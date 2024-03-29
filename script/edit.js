'use strict';

// Select elements
const activeForm = document.getElementById('container-form');
const submitBtn = document.getElementById('submit-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const ageInput = document.getElementById('input-age');
const typeInput = document.getElementById('input-type');
const weightInput = document.getElementById('input-weight');
const lengthInput = document.getElementById('input-length');
const colorInput = document.getElementById('input-color-1');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
let petArr = [];
let breedArr = [];
const tableBodyEl = document.getElementById('tbody');

// Reload BreedArr
function renderBreed() {
  breedInput.innerHTML = '<option>Select Breed</option>';
  breedArr
    .filter(breed => breed.type === typeInput.value)
    .forEach(breed => {
      const option = document.createElement('option');
      option.innerHTML = breed.breed;
      breedInput.appendChild(option);
    });
}
if (Array.isArray(getFromStorage('breedArr'))) {
  let test = true;
  const checkArr = ['type', 'breed'];
  getFromStorage('breedArr').forEach(breed => {
    checkArr.forEach(check => {
      if (!breed.hasOwnProperty(`${check}`)) {
        test = false;
      }
    });
  });
  if (test) {
    // Show breeds by type
    breedArr = getFromStorage('breedArr');
    typeInput.addEventListener('change', renderBreed);
  }
}

// Reload PetArr
if (Array.isArray(getFromStorage('petArr'))) {
  let test = true;
  let checkArr = ['id', 'name', 'type', 'weight', 'length', 'color', 'breed', 'vaccinated', 'dewormed', 'sterilized', 'date'];
  getFromStorage('petArr').forEach(pet => {
    checkArr.forEach(check => {
      if (!pet.hasOwnProperty(`${check}`)) {
        test = false;
      }
    });
  });
  if (test) {
    petArr = getFromStorage('petArr');
    newDate(petArr);
    renderTableData(petArr);
  }
}

// Convert date string to date
function newDate(petArr) {
  petArr.forEach((pet, i, petArr) => {
    petArr[i].date = new Date(pet.date);
  });
}

// Show pet list
function renderTableData(pets) {
  tableBodyEl.innerHTML = '';
  pets.forEach(pet => {
    const row = document.createElement('tr');
    row.innerHTML = genRow(pet);
    tableBodyEl.appendChild(row);
  });
}
function genRow(row) {
  return `
    <th scope="row">${row.id}</th>
    <td>${row.name}</td>
    <td>${row.age}</td>
    <td>${row.type}</td>
    <td>${row.weight} kg</td>
    <td>${row.length} cm</td>
    <td>${row.breed}</td>
    <td>
      <i class="bi bi-square-fill" style="color: ${row.color}"></i>
    </td>
    <td>
      <i class="bi ${row.vaccinated ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
    </td>
    <td>
      <i class="bi ${row.dewormed ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} "></i>
    </td>
    <td>
      <i class="bi ${row.sterilized ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} "></i>
    </td>
    <td>${row.date.getDate()}/${row.date.getMonth() + 1}/${row.date.getFullYear()}</td>
    <td>
      <button type="button" class="btn btn-warning" id="btn-edit" data-id="${row.id}">Edit</button>
    </td>
  `;
}

// Edit pet
let petID, pet;
tableBodyEl.addEventListener('click', edit);
function edit(e) {
  if (e.target.id !== 'btn-edit') return;
  petID = e.target.getAttribute('data-id');
  if (!petID) return;
  activeForm.classList.remove('hide');
  pet = petArr.find(pet => pet.id === petID);

  //Set input values ​​will be the current value of that pet
  idInput.value = pet.id;
  nameInput.value = pet.name;
  ageInput.value = pet.age;
  typeInput.value = pet.type;
  weightInput.value = pet.weight;
  lengthInput.value = pet.length;
  colorInput.value = pet.color;
  vaccinatedInput.checked = pet.vaccinated;
  dewormedInput.checked = pet.dewormed;
  sterilizedInput.checked = pet.sterilized;
  renderBreed();
  breedInput.value = pet.breed;
}

// Save pet to the list
submitBtn.addEventListener('click', function () {
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: parseInt(weightInput.value),
    length: parseInt(lengthInput.value),
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    date: pet.date,
  };

  const validatedForm = function () {
    if (data.name === '') {
      alert('Please input for name');
      nameInput.focus();
      return false;
    }
    if (isNaN(data.age)) {
      alert('Please input for age');
      ageInput.focus();
      return false;
    } else if (data.age < 1 || data.age > 15) {
      alert('Age must be between 1 and 15!');
      ageInput.focus();
      return false;
    }
    if (data.type === 'Select Type') {
      alert('Please select Type!');
      typeInput.focus();
      return false;
    }
    if (isNaN(data.weight)) {
      alert('Please input for weight');
      weightInput.focus();
      return false;
    } else if (data.weight < 1 || data.weight > 15) {
      alert('Weight must be between 1 and 15!');
      weightInput.focus();
      return false;
    }
    if (isNaN(data.length)) {
      alert('Please input for length');
      lengthInput.focus();
      return false;
    } else if (data.length < 1 || data.length > 100) {
      alert('Length must be between 1 and 100!');
      lengthInput.focus();
      return false;
    }
    if (data.breed === 'Select Breed') {
      alert('Please select Breed!');
      breedInput.focus();
      return false;
    }
    return true;
  };
  const validated = validatedForm();

  if (validated) {
    const index = petArr.findIndex(pet => pet.id === petID);
    petArr.splice(index, 1, data);
    saveToStorage('petArr', petArr);
    renderTableData(petArr);
    activeForm.classList.add('hide');
  }
});
