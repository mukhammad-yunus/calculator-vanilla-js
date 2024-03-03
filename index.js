import { displayKeyboard } from "./component.js";
displayKeyboard();
const inputEl = document.querySelector(".input");
const resultEl = document.querySelector(".result");
const initInputEl = `<div class="input"></div>`;
let inputVal = "";
let result = "";
let lastChar = "0";
const keyEls = document.querySelectorAll(".key");
keyEls.forEach((key) =>
  key.addEventListener("click", (e) => {
    let dataInfoValue = e.target.dataset.function;
    if (dataInfoValue) {
      handleSpecialOp(dataInfoValue);
    } else {
      const innerText = e.target.innerText;
      handleDisplay(innerText);
    }
  })
);

window.addEventListener("keydown", (e) => {
  if (
    !(
      /^[0-9+\-*/%()=]$/.test(e.key) ||
      e.key === "Enter" ||
      e.key === "Backspace" ||
      e.key === "Delete"
    )
  )
    return;
  if (
    e.key === "(" ||
    e.key === ")" ||
    e.key === "Backspace" ||
    e.key === "Delete"
  ) {
    handleSpecialOp(e.key);
  } else {
    
    handleDisplay(e.key);
  }
});

function calculate() {
    lastChar = inputVal[inputVal.length-1];
    const isOperator = ("+\-*/%").includes(lastChar);
    console.log(isOperator);
    if (isOperator) {
        
        inputVal = inputVal.slice(0, -1);
        result = String(eval(`(${inputVal})`));
        resultEl.textContent = result;
        inputEl.textContent = inputVal;
        //.round .toFixed, generally you have to make it responsive so that numbers should fit the space
    } else{
        result = String(eval(`(${inputVal})`));
        resultEl.textContent = result;
        //.round .toFixed, generally you have to make it responsive so that numbers should fit the space

    }
}

function handleDisplay(key) {
    const isZero = inputEl.innerText == "0";
    const isOperator = ("+\-*/%").includes(key);
    const isDoubleOp = ("+\-*/%").includes(lastChar)&&isOperator;
    
    if( (isZero && isOperator) ||isDoubleOp ) return;
//Above prevents operators being used in the beginning or being used multiple times

  if (key == "=" || key === "Enter") {
    calculate();
  } else {
    if (result) {
      inputEl.textContent = key;
      inputVal = key;
      lastChar = key;
      result = "";
      resultEl.innerText = "";
    } else {
      if (inputEl.innerText == "0") {
        inputEl.textContent = key;
        inputVal = key;
        lastChar = key;
      } else {
        inputEl.textContent += key;
        inputVal += key;
        lastChar = key;
      }
    }
  }
}


function handleSpecialOp(value) {
  switch (value) {
    case "Delete":
      inputEl.innerText = "0";
      result = "";
      resultEl.innerText = "";
      break;
    case "Backspace":
      if (result) {
        inputEl.innerText = "0";
        result = "";
        resultEl.innerText = "";
      } else {
        if (inputEl.innerText == "0" || inputEl.innerText.length == 1) {
            inputEl.innerText = "0"
        } else{
            inputEl.innerText = inputEl.innerText.slice(0, -1);
            resultEl.innerText = "";
            result = "";
        }
      }
  }
}
