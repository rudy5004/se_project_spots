const initialCards = [
{name: "Val Thorens",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
{name: "Restaurant terrace",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
{name: "An outdoor cafe",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
{name: "A very long bridge, over the forest and through the trees", 
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},   
{name: "navigator,Tunnel with morning light",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
{name: "Mountain house",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
{name: "landscape view",
link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"},
];

const editModalBtn = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector('.profile__new-post-button')
const profileName = document.querySelector(`.profile__name-main`);
const profileDescription = document.querySelector(`.profile__name-description`);

const allModals = [...document.querySelectorAll('.modal')];

const editModal = document.querySelector("#edit-modal");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector(`#profile-name-input`);
const editModalDescriptionInput = editModal.querySelector(`#profile-description-input`);
const editFormElement = editModal.querySelector(`.modal__form`);

const cardModal = document.querySelector('#add-card-modal');
const cardModalCloseBtn = cardModal.querySelector('.modal__close-btn');
const cardFormElement = cardModal.querySelector(`.modal__form`);
const cardSubmitBtn = cardModal.querySelector(`.modal__button`);
const cardModalLinkInput = cardModal.querySelector(`#card-link-input`);
const cardModalNameInput = cardModal.querySelector(`#card-link-input-caption`);

const previewModal = document.querySelector('#preview-modal');
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalPicDescription = previewModal.querySelector(".modal__pic-description");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn_type_preview");


const cardTemplate = document.querySelector(`#card-template`);
const cardsList = document.querySelector(`.cards__list`);

function getCardElement(data){

    const cardElement = cardTemplate.content.querySelector(`.card`).cloneNode(true);
    const cardDeleteBtn = cardElement.querySelector(`.card__delete-btn`);
    const cardNameElement = cardElement.querySelector(`.card__title`);
    const cardImageElement = cardElement.querySelector(`.card__image`);
    const cardLikeBtn = cardElement.querySelector(`.card__like-button`);
    
    cardNameElement.textContent = data.name;
    cardImageElement.src = data.link;
    cardImageElement.alt = data.name;

    cardLikeBtn.addEventListener("click", () => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
    });

    cardDeleteBtn.addEventListener("click", () => {
        cardElement.remove();
    });
    
    cardImageElement.addEventListener("click", () => {
        openModal(previewModal);
        previewModalImage.src = data.link;
        previewModalImage.alt = data.name;
        previewModalPicDescription.textContent = data.name;
    });
    return cardElement;
}
function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener('keydown', closeModalEscape);
}
function closeModal(modal){
    modal.classList.remove("modal_opened");
    document.removeEventListener('keydown', closeModalEscape);  
}
previewModalCloseBtn.addEventListener("click", () =>{
    closeModal(previewModal);});

function handleEditFormSubmit(evt) {
    evt.preventDefault(); 
    profileName.textContent = editModalNameInput.value; 
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
}
function handleCardFormSubmit(evt){
    evt.preventDefault();
    const inputValues = {name: cardModalNameInput.value, link: cardModalLinkInput.value};
    const cardElement = getCardElement(inputValues);
    cardFormElement.reset();
    cardsList.prepend(cardElement);
    disableButton(cardSubmitBtn, settings);
    closeModal(cardModal);
}

cardModalCloseBtn.addEventListener("click", () => {
    closeModal(cardModal) });

editModalCloseBtn.addEventListener("click", () => {
    closeModal(editModal) 
});

function closeModalEscape(event) { 
    if (event.key === 'Escape') {
        const modal = document.querySelector(".modal_opened");
        closeModal(modal);
    }
}
function handleOverlay(){
    allModals.forEach(modal => {
        modal.addEventListener("click", (evt) => {
        if (evt.target === modal){
        closeModal(modal);}
    });
});
}

editModalBtn.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
    resetValidation(editFormElement, [editModalNameInput, editModalDescriptionInput], settings);
    openModal(editModal) 
});
editFormElement.addEventListener('submit', handleEditFormSubmit);

cardModalBtn.addEventListener("click", () => {
    openModal(cardModal) 
});

cardFormElement.addEventListener('submit', handleCardFormSubmit);

initialCards.forEach(function(ArrayItem){
    const cardElement = getCardElement(ArrayItem);
    cardsList.prepend(cardElement);
});

handleOverlay();

