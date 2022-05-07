// water tracker app 

// ML's are used as base unit for all calculations
let options = {
    'Liter': 1000,
    'Millileter': 1,
    'Cup': 236.588,
    'Gallon': 3785.41 
};

let lsKey = 'water-tracker-data';
let waterData = {};
let today = getCurrentDateString();
let totalUnit;

init();

function init() {
    fetchWaterData();
    buildUI();
    displayTodaysTotal();
}

function buildUI() {
    // populate dropdown menu with options
    let select = document.querySelector('#type-units');
    Object.keys(options).forEach(unit => {
        select.insertAdjacentHTML('beforeend', `<option value="${unit}">${unit}</option>`);
    }); 
    
    // add event listener for add button
    let button = document.querySelector('#add-btn');
    button.addEventListener('click', addWater);
    
    // get unit to display total 
    let lsTotalUnit = localStorage.getItem('water-tracker-display');
    totalUnit = lsTotalUnit || 'Liter';

    // add ability to toggle display between L and G
    let totalDisplayToggle = document.querySelector('#total-unit');
    totalDisplayToggle.addEventListener('click', () => {
        if (totalUnit === 'Liter') totalUnit = 'Gallon';
        else totalUnit = 'Liter';
        displayTodaysTotal();
    });
}

function displayTodaysTotal() {
    // display type of unit below total number
    let totalUnitType= document.querySelector('#total-unit-type');
    totalUnitType.innerHTML = totalUnit;

    // calculate total based on display unit type (G or L) and display
    let todaysTotal = getTodaysTotal() / options[totalUnit];
    let formattedData = Number(todaysTotal).toFixed(2);

    document.querySelector('#total').innerHTML = formattedData;

    let pluralEl = document.querySelector('#plural');
    if (formattedData > 1) {
        pluralEl.style.display = 'inline';
    }
    else if (pluralEl.style.display) {
        pluralEl.style.removeProperty('display');
    }
}

function addWater() {
    let errorEl = document.querySelector('#error');
    let unit = document.querySelector('#type-units').value;
    let numberUnits = document.querySelector('#number-units').value;

    if (!numberUnits || isNaN(parseFloat(numberUnits))) {
        document.querySelector('#error').innerHTML = 'Please enter a valid number!';
        return;
    }

    // reset 
    errorEl.innerHTML = '';

    // convert input to ML and add to total
    let millileters = options[unit] * parseFloat(numberUnits);
    waterData[today] += millileters;

    // update local storage
    localStorage.setItem(lsKey, JSON.stringify(waterData));

    // refresh display
    displayTodaysTotal();
}

function getTodaysTotal() {
    return waterData[today];
}

function getCurrentDateString() {
    let date = new Date();
    return `${date.getFullYear()}|${date.getMonth() + 1}|${date.getDay() + 1}`;
}

function fetchWaterData() {
    let data = localStorage.getItem(lsKey);
    if (data) waterData = JSON.parse(data);
    else waterData[today] = 0;
}