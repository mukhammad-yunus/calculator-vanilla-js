import { displayKeyboard } from "./component.js";
displayKeyboard();
const inputEl = document.querySelector(".input");
const resultEl = document.querySelector(".result");
let inputVal = "0";
let result = "";
let lastChar = "0";
let lastNum = "";
let parenthesis = 0;
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
      /^[0-9+\-*/()=.]$/.test(e.key) ||
      e.key === "Enter" ||
      e.key === "Backspace" ||
      e.key === "Delete"
    )
  )
    return;
  if (e.key === "Backspace" || e.key === "Delete") {
    handleSpecialOp(e.key);
  } else {
    handleDisplay(e.key);
  }
});

function calculate() {
  function calculationDisplay() {
    let temp = String(result);
    let isPoint = temp.includes(".") && temp.length > 14;
    if (isPoint || temp.length > 14) {
      result = String(result.toPrecision(14));
    } else {
      result = temp;
    }

    resultEl.textContent = result;
  }
  if (parenthesis != 0) {
    for (let i = 0; i < parenthesis; i++) {
      inputVal += ")";
      inputEl.textContent = inputVal;
    }
  }
  lastChar = inputVal[inputVal.length - 1];
  const isOperator = "+-*/".includes(lastChar);
  if (isOperator) {
    try {
      inputVal = inputVal.slice(0, -1);
      inputEl.textContent = inputVal;
      result = eval(`(${inputVal})`);
      if (isNaN(result)) {
        throw new Error("error");
      }
      calculationDisplay();
    } catch (error) {
      result = "error";
      resultEl.textContent = result;
    }
  } else {
    try {
      result = eval(`${inputVal}`);
      if (isNaN(result)) {
        throw new Error("error");
      }
      calculationDisplay();
    } catch (error) {
      result = "error";
      resultEl.textContent = result;
    }
  }
}

function handleDisplay(key) {
  const isZero = inputEl.innerText == "0";
  const isOperator = "+-*/".includes(key);
  const isDoubleOp = "+-*/".includes(lastChar) && isOperator;
  if (isDoubleOp) return;
  //Above prevents operators being used multiple times
  if (key == "=" || key === "Enter") {
    if (!result) {
      calculate();
    }
  } else {
    if (result) {
      if (isOperator && result != "error") {
        inputEl.textContent = result + key;
        inputVal = result + key;
        lastChar = key;
        lastNum = "";
        result = "";
        resultEl.innerText = result;
        return;
      } else if (isOperator) {
        inputVal = "0";
        inputEl.textContent = inputVal;
        lastChar = "";
        result = "";
        resultEl.innerText = result;
        return;
      }

      inputVal = key;
      inputEl.textContent = inputVal;
      lastChar = key;
      result = "";
      resultEl.innerText = "";
    } else if (key == "(" || key == ")") {
      handleParenthesis();
    } else {
      if (!isOperator) {
        lastNum += key;
      } else {
        lastNum = "";
      }
      if ((isZero && !isOperator && key != ".") || (isZero && key == "0")) {
        inputVal = key;
        inputEl.textContent = inputVal;
        lastChar = key;
      } else {
        inputVal += key;
        inputEl.textContent = inputVal;
        lastChar = key;
      }
      // if()
    }
  }
}

function handleSpecialOp(value) {
  switch (value) {
    case "Delete":
      inputVal = "0";
      inputEl.innerText = inputVal;
      lastNum = "";
      result = "";
      resultEl.innerText = "";
      break;
    case "Backspace":
      handleBackspace();
      break;
    case "invert":
      if (!lastNum) return;
      toggleNumber(lastNum);
      break;
    case "Parenthesis":
      handleParenthesis();
      break;
  }
}

function handleBackspace() {
  if (result && result != "error") {
    inputVal = "0";
    inputEl.textContent = inputVal;
    result = "";
    lastNum = "";
    resultEl.textContent = "";
  } else {
    if (result == "error") {
      result = "";
      resultEl.textContent = result;
    }
    if (inputVal == "0" || inputVal.length == 1) {
      inputVal = "0";
      inputEl.textContent = inputVal;
      lastNum = "";
    } else {
      inputVal = inputEl.textContent.slice(0, -1);
      inputEl.textContent = inputVal;
      const lastIndex = inputVal.length - 1;
      lastChar = inputVal[lastIndex];
      lastNum = findLastNumber(inputVal);
      console.log(lastNum);
    }
  }
}

function findLastNumber(expression) {
  const reversed = expression.split("").reverse();

  let lastNumber = "";
  let foundOperator = false;
  for (const char of reversed) {
    if ("0123456789.".includes(char)) {
      lastNumber = char + lastNumber;
    } else if (`\+-*/`) {
      foundOperator = true;
      break;
    }
  }
  return foundOperator ? lastNumber : "";
}
function toggleNumber(num) {
  const invertNum = -1 * parseFloat(num);

  if (invertNum > 0) {
    let index = `(${lastNum})`.length * -1;
    inputVal = inputVal.slice(0, index) + invertNum;
    inputEl.textContent = inputVal;
    lastNum = String(invertNum);
  } else {
    let index = lastNum.length * -1;
    inputVal = `${inputVal.slice(0, index)}(${invertNum})`;
    inputEl.textContent = inputVal;
    lastNum = String(invertNum);
  }
}

function handleParenthesis() {
  const isOperator = "+-*/".includes(lastChar);

  if (lastNum) {
    if (!isOperator && parenthesis === 0) {
      inputVal += "*(";
      parenthesis++;
      parenthesisDisplay(inputVal, "(");
      return;
    }
    if (parenthesis == 0) return;
    inputVal += ")";
    parenthesis--;
    parenthesisDisplay(inputVal, ")");
  } else {
    if (lastChar == ")" && !parenthesis) {
      inputVal += "*(";
      parenthesis++;
      parenthesisDisplay(inputVal, "(");
      return;
    }
    if (inputVal === "0" && lastChar != ")") {
      inputVal = "(";
      parenthesis++;
      parenthesisDisplay(inputVal, "(");
      return;
    } else if (inputVal != "0" && lastChar != ")") {
      inputVal += "(";
      parenthesis++;
      parenthesisDisplay(inputVal, "(");

      return;
    } else if (parenthesis > 0) {
      inputVal += ")";
      parenthesis--;
      parenthesisDisplay(inputVal, ")");
    }
  }
}
function parenthesisDisplay(value, key) {
  inputEl.textContent = value;
  lastChar = key;
  lastNum = "";
}
