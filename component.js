import { data } from "./constants.js";
const keyboardEl = document.getElementById("keyboard");

export function displayKeyboard(){
    const length = data.length;
    let container = [];
    for (let i = 0; i < length; i++) {
        let subContainer = [];
        const element = data[i];
        for (let j = 0; j < element.length; j++) {
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
