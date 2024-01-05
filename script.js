/**
 * Represents a calorie counter application.
 * @module CalorieCounter
 */

/**
 * The main element of the calorie counter application.
 * @type {HTMLElement}
 */
const calorieCounter = document.getElementById('calorie-counter');

/**
 * The input element for the budget number.
 * @type {HTMLElement}
 */
const budgetNumberInput = document.getElementById('budget');

/**
 * The dropdown element for selecting entry types.
 * @type {HTMLElement}
 */
const entryDropdown = document.getElementById('entry-dropdown');

/**
 * The button element for adding an entry.
 * @type {HTMLElement}
 */
const addEntryButton = document.getElementById('add-entry');

/**
 * The button element for clearing the form.
 * @type {HTMLElement}
 */
const clearButton = document.getElementById('clear');

/**
 * The output element for displaying the calorie calculation results.
 * @type {HTMLElement}
 */
const output = document.getElementById('output');

/**
 * Flag indicating if there is an error in the input.
 * @type {boolean}
 */
let isError = false;

/**
 * Cleans the input string by removing unwanted characters.
 * @param {string} str - The input string to be cleaned.
 * @returns {string} The cleaned input string.
 */
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

/**
 * Checks if the input string is invalid.
 * @param {string} str - The input string to be checked.
 * @returns {boolean} True if the input string is invalid, false otherwise.
 */
function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

/**
 * Adds an entry to the form based on the selected entry type.
 */
function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
        type="number"
        min="0"
        id="${entryDropdown.value}-${entryNumber}-calories"
        placeholder="Calories"
    />`;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

/**
 * Calculates the total calories and displays the results.
 * @param {Event} e - The submit event.
 */
function calculateCalories(e) {
    e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories >= 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;

    output.classList.remove('hide');
}

/**
 * Calculates the total calories from a list of input elements.
 * @param {NodeList} list - The list of input elements.
 * @returns {number|null} The total calories or null if there is an invalid input.
 */
function getCaloriesFromInputs(list) {
    let calories = 0;

    for (let i = 0; i < list.length; i++) {
        const currVal = cleanInputString(list[i].value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

/**
 * Clears the form and output.
 */
function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    for (let i = 0; i < inputContainers.length; i++) {
        inputContainers[i].innerHTML = '';
    }

    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);

