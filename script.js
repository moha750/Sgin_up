//Get all input elements of the form with a .input class
const getInputs = container => [...container.querySelectorAll('.input')];

//Get all fieldsets within the form element 

const getFieldsets = container => [...container.querySelectorAll('fieldset')];

//Get an Array with the distance of each fieldset element to apply a margin
const getArrayOfMargins = fieldsetsContainer => {
  return getFieldsets(fieldsetsContainer).map((fieldset, i) => fieldset.offsetHeight * i);

};



// Apply or add .focus class according if a element gain or loss its focus.
let inpustEvent = container => {

  getInputs(container).map(input => {
    input.addEventListener("focusin", e => {
      let inputParent = e.target.parentElement;

      if (!inputParent.classList.contains('focus')) {
        inputParent.classList.add('focus');
      }
    });
    input.addEventListener("blur", e => {
      let inputParent = e.target.parentElement;
      if (input.required) {
        if (e.target.value == "") {
          inputParent.classList.replace('focus', 'error');
        } else {
          inputParent.classList.remove('error');
        }
      } else {
        if (e.target.value == "") {
          inputParent.classList.remove('focus');
        }
      }

    });
    input.addEventListener('keydown', e => {

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (e.key === "Enter") {
          container.querySelectorAll('.next')[0].click();
        }

      }
    });


  });
};
//Add function Navegation Prev and Next fr the fieldsets elements

let formNavigation = (buttonsContainer, fieldsetsContainer, progressBarContainer, i) => {
  let margins = getArrayOfMargins(fieldsetsContainer),
  margin,
  progressBarItems = [...progressBarContainer.querySelectorAll('li')];


  buttonsContainer.addEventListener("click", e => {

    e.preventDefault();

    let el = e.target,
    getFieldsetsLenght = getFieldsets(fieldsetsContainer).length;

    if (el.tagName === "BUTTON") {

      if (el.classList.contains("prev")) {



        if (i > 0) {
          margin = -margins[i - 1];
          i--;
        } else {
          i = 0;
        }

        fieldsetsContainer.style.marginTop = margin + "px";



      } else if (el.classList.contains("next")) {

        if (formValidation(i, fieldsetsContainer, progressBarContainer)) {

          if (i == getFieldsetsLenght - 1) {

            // margin = margins[0];
            i = getFieldsetsLenght - 1;
            document.querySelectorAll('.submit-button')[0].classList.add('active');

          } else {

            margin = -margins[i + 1];
            i++;

          }

        }
        fieldsetsContainer.style.marginTop = margin + "px";
      }

    }
    progressBarItems.forEach(element => {
      if (progressBarItems[i] === element) {
        element.classList.add('current');
        if (element.classList.contains('complete')) {
          element.classList.remove('current');
        }
      } else {
        element.classList.remove('current');
      }

    });
  });
  progressBar(progressBarContainer, fieldsetsContainer);

};


//Add function navegation with the progress bar. 

let progressBar = (progressBarContainer, fieldsetsContainer) => {

  let links = [...progressBarContainer.querySelectorAll('a')],
  margins = getArrayOfMargins(fieldsetsContainer);

  progressBarContainer.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.tagName === "A" && (e.target.parentElement.classList.contains('complete') || e.target.parentElement.classList.contains('current'))) {
      let index = links.indexOf(e.target);
      fieldsetsContainer.style.marginTop = -margins[index] + "px";
    }

  });
};
//Form Validation for each group of inputs within the fieldsets elements. Here you can add your own custom validation.

let formValidation = (i, fieldsetsContainer, progressBarContainer) => {

  let fieldsets = getFieldsets(fieldsetsContainer),
  currentFieldset = fieldsets[i],
  inputs = getInputs(currentFieldset);


  for (const key in inputs) {

    let input = inputs[key];
    if (input.required) {
      if (input.value != "") {

        input.parentElement.classList.remove('error');
        continue;

      } else {

        console.dir(input.required);
        input.parentElement.classList.add('error');
        return false;

      }
    }

  }
  progressBarContainer.querySelectorAll('li')[i].classList.add('complete');

  return true;

};

//Submit button. Here you can add ajax request.
let submit = (container, fieldsetsContainer) => {
  let submitButton = container.querySelectorAll("input[type='submit']");
  container.addEventListener('click', e => {
    if (e.target.type === "submit" && e.target.tagName === "INPUT") {
      e.preventDefault();
      let overlay = document.createElement('div');
      overlay.classList.add('overlay');
      container.appendChild(overlay);
    }
  });

};


const stepsforminit = container => {
  let form = container,
  fieldsetsContainer = container.querySelectorAll('#fieldset-container')[0],
  progressBarContainer = container.querySelectorAll('#progress-bar')[0],
  buttonsContainer = container.querySelectorAll('.tab-nav')[0],
  i = 0;
  inpustEvent(form);
  formNavigation(buttonsContainer, fieldsetsContainer, progressBarContainer, i);
  submit(form, fieldsetsContainer);
};

stepsforminit(document.getElementById('form-wrapper'));
