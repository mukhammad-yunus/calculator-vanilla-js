import { data } from "./constants.js";
const keyboardEl = document.getElementById("keyboard");
// This entire component.js is dedicated to render dynamically, instead of static way, the keyboard of the calculator,
export function displayKeyboard(){
    const length = data.length;
    let container = [];
    for (let i = 0; i < length; i++) {
        let subContainer = [];
        const element = data[i];
        for (let j = 0; j < element.length; j++) {
            // Main function of if-else statement here is to identify if an element is pure value or ready-to-render.
            // ready-to-render elements are used for keys with data property and icon.
            if (element[j].length > 1) {
                subContainer.push(element[j]);
            } else{
                subContainer.push( `<div class="key">${element[j]}</div>`);
            }
        }
        const result = `<section class="key-container">${subContainer.join("")}</section>`
        container.push(result);
    }
    keyboardEl.innerHTML = container.join("");
}
