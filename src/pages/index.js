import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText, deleteButtonText } from "../utils/helpers.js";

const editModalBtn = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__new-post-button");
const profileName = document.querySelector(`.profile__name-main`);
const profileDescription = document.querySelector(`.profile__name-description`);

const profileAvatar = document.querySelector(`.profile__avatar`);
const avatarModalBtn = document.querySelector(`.profile__avatar-btn`);

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarFormElement = avatarModal.querySelector(`.modal__form`);
const avatarModalLinkInput = avatarModal.querySelector(`#profile-avatar-input`);
const avatarSaveBtn = avatarModal.querySelector(`.modal__button`);

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

const allModals = [...document.querySelectorAll(".modal")];

const editModal = document.querySelector("#edit-modal");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector(`#profile-name-input`);
const editModalDescriptionInput = editModal.querySelector(
  `#profile-description-input`
);
const editFormElement = editModal.querySelector(`.modal__form`);
const editSaveBtn = editModal.querySelector(`.modal__button`);

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardFormElement = cardModal.querySelector(`.modal__form`);
const cardSubmitBtn = cardModal.querySelector(`.modal__button`);
const cardModalLinkInput = cardModal.querySelector(`#card-link-input`);
const cardModalNameInput = cardModal.querySelector(`#card-link-input-caption`);

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalPicDescription = previewModal.querySelector(
  ".modal__pic-description"
);
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const cardTemplate = document.querySelector(`#card-template`);
const cardsList = document.querySelector(`.cards__list`);

let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e36594c-9f58-43ca-8212-d4a4b67e7c65",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach(function (ArrayItem) {
      const cardElement = getCardElement(ArrayItem);
      cardsList.prepend(cardElement);
    });
    profileAvatar.src = userInfo.avatar;
    profileAvatar.alt = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileAvatar.alt = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(`.card`)
    .cloneNode(true);
  const cardDeleteBtn = cardElement.querySelector(`.card__delete-btn`);
  const cardNameElement = cardElement.querySelector(`.card__title`);
  const cardImageElement = cardElement.querySelector(`.card__image`);
  const cardLikeBtn = cardElement.querySelector(`.card__like-button`);

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleCardLike(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalPicDescription.textContent = data.name;
  });
  return cardElement;
}
function handleCardLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalEscape);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalEscape);
}
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});
function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}
function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .postInitialCards(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardFormElement.reset();
      cardsList.prepend(cardElement);
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarModalLinkInput.value)

    .then((data) => {
      profileAvatar.src = data.avatar;
      profileAvatar.alt = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}
function closeModalEscape(event) {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}
function handleOverlay() {
  allModals.forEach((modal) => {
    modal.addEventListener("click", (evt) => {
      if (evt.target === modal) {
        closeModal(modal);
      }
    });
  });
}
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

editModalBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});
editFormElement.addEventListener("submit", handleEditFormSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("click", () => {
  closeModal(deleteModal);
});

cardFormElement.addEventListener("submit", handleCardFormSubmit);
avatarFormElement.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

handleOverlay();
enableValidation(settings);
