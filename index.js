// water tracker app 

let options = {
    'Millileter': 1,
    'Liter': 1000,
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

    let totalDisplayToggle = document.querySelector('#total-unit-type');
    totalDisplayToggle.addEventListener('click', () => {
        if (totalUnit === 'Liter') totalUnit = 'Gallon';
        else totalUnit = 'Liter';
        displayTodaysTotal();
    });
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

function displayTodaysTotal() {
    // set up total unit toggle
    let totalDisplayToggle = document.querySelector('#total-unit-type');
    totalDisplayToggle.innerHTML = totalUnit;

    if (getTodaysTotal() > 1) {
        document.querySelector('#plural').style.display = 'inline';
    }

    let todaysTotal = getTodaysTotal() / options[totalUnit];
    let formattedData = Number(todaysTotal).toFixed(2);
    document.querySelector('#total').innerHTML = formattedData;
}

function addWater() {
    let unit = document.querySelector('#type-units').value;
    let numberUnits = document.querySelector('#number-units').value;

    console.log(unit, numberUnits)
    if (!numberUnits) return alert('Enter a valid number!');

    let millileters = options[unit] * numberUnits;
    waterData[today] += millileters;
    console.log(waterData)
    localStorage.setItem(lsKey, JSON.stringify(waterData));

    displayTodaysTotal();
}