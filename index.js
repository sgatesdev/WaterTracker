// water tracker app 

// ML's are used as base unit for all calculations
let options = {
    'Liter': 1000,
    'Millileter': 1,
    'Gallon': 3785.41,
    'Pint': 568.261,
    'Cup': 236.588,
    'fl oz': 29.5735,
};

let lsTrackerData = 'water-tracker-data';
let lsTrackerDisplayUnit = 'water-tracker-display';
let waterData = {};
let today = getCurrentDateString();
let totalUnit;
let totalUnitIndex = 0;

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
    let lsTotalUnit = localStorage.getItem(lsTrackerDisplayUnit);
    if (!lsTotalUnit) {
        totalUnit = 'Liter';
        setTotalUnit(totalUnit);
    }
    else {
        totalUnit = lsTotalUnit;
    }

    // add ability to toggle display between L and G
    let totalDisplayToggle = document.querySelector('#middle');
    totalDisplayToggle.addEventListener('click', () => {
        // go to next unit 
        totalUnitIndex++;

        // make sure we stay within bounds of available units
        let optionKeyArray = Object.keys(options);        
        if (totalUnitIndex >= optionKeyArray.length) {
            totalUnitIndex = 0;
        }

        // set display type 
        totalUnit = optionKeyArray[totalUnitIndex];
        setTotalUnit(totalUnit);
        displayTodaysTotal();
    });

    // add reset option at bottom
    document.querySelector('#reset').addEventListener('click', resetCount);
}

function displayTodaysTotal() {
    // display type of unit below total number
    let totalUnitType= document.querySelector('#total-unit-type');
    totalUnitType.innerHTML = totalUnit;

    // calculate total based on display unit type (G or L) and display
    let todaysTotal = getTodaysTotal() / options[totalUnit];
    let formattedData = Number(todaysTotal).toFixed(2);

    document.querySelector('#total').innerHTML = formattedData;
}

function addWater() {
    let errorEl = document.querySelector('#error');
    let unit = document.querySelector('#type-units').value;
    let numberUnits = parseFloat(document.querySelector('#number-units').value);

    if (!numberUnits || isNaN(numberUnits) || numberUnits <= 0) {
        errorEl.style.display = 'inline';
        errorEl.innerHTML = 'Please enter a valid number.';
        return;
    }

    // reset 
    errorEl.style.display = 'none';
    errorEl.innerHTML = '';

    // convert input to ML and add to total
    let millileters = options[unit] * numberUnits;
    waterData[today] += millileters;

    // update local storage
    localStorage.setItem(lsTrackerData, JSON.stringify(waterData));

    // refresh display
    displayTodaysTotal();
}

function resetCount() {
    if (waterData[today]) delete waterData[today];
    else return;

    localStorage.setItem(lsTrackerData, JSON.stringify(waterData));

    displayTodaysTotal();
}

function getTodaysTotal() {
    if (!waterData[today]) waterData[today] = 0;
    return waterData[today];
}

function getCurrentDateString() {
    let date = new Date();
    return `${date.getFullYear()}|${date.getMonth() + 1}|${date.getDay() + 1}`;
}

function fetchWaterData() {
    let data = localStorage.getItem(lsTrackerData);
    if (data) waterData = JSON.parse(data);
    else waterData[today] = 0;
}

function setTotalUnit(type) {
    localStorage.setItem(lsTrackerDisplayUnit, type);
}