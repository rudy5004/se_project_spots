const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_inactive",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error"
}
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
  inputElement.classList.add(config.inputErrorClass);
};
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
  inputElement.classList.remove(config.inputErrorClass);
};
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};
const hasInvalidInput = (inputLists) => {
  return inputLists.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};
const toggleButtonState = (inputLists, buttonElement, config) => {
  if (hasInvalidInput(inputLists)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false; 
  }
};
const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
}
const resetValidation = (formElement, inputLists, config) => {
  inputLists.forEach((input) => {
  hideInputError(formElement, input, config);
})
}
const setEventListeners = (formElement, config) => {
  const inputLists = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
   
  toggleButtonState(inputLists, buttonElement, config);

  inputLists.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputLists, buttonElement, config);
    });
  });
};
const enableValidation = (config) => {
  const formLists = document.querySelectorAll(config.formSelector);
  formLists.forEach((formElement) => {
      setEventListeners(formElement, config);
  });
};
enableValidation(settings);