import { displayKeyboard } from "./component.js";
//Generates all key buttons
displayKeyboard();

// All ELEMENT selectors
const inputEl = document.querySelector(".input"); // Selects input element of the calculator
const resultEl = document.querySelector(".result"); // Selects result element of the calculator
const keyEls = document.querySelectorAll(".key"); //Selects all key buttons on the keyboard

//all VARIABLES that are changed throughout the program.
let inputVal = "0"; // Stores input value as user clicks
let result = ""; // Stores <result>
let lastChar = "0"; // Stores <the last character entered>
let lastNum = ""; // Stores <the last complete number entered>
let parenthesis = 0; // Counts the number of parenthesis

// ---> EVENT LISTENERS <----
// Click event listener for the key buttons
keyEls.forEach((key) =>
  key.addEventListener("click", (e) => {
    // There are buttons with special information. If the current event has one or not,boolean be stored in dataInfoValue
    let dataInfoValue = e.target.dataset.function;
    if (dataInfoValue) {
      handleSpecialOp(dataInfoValue);
    } else {
      const innerText = e.target.textContent;
      handleDisplay(innerText);
    }
  })
);

// Keyboard event listener for pc keyboard
window.addEventListener("keydown", (e) => {
  //Checks if the keyboard clicked is valid or not
  const isValidKeyboard =
    /^[0-9+\-*/()=.]$/.test(e.key) ||
    e.key === "Enter" ||
    e.key === "Backspace" ||
    e.key === "Delete";
  if (!isValidKeyboard) return;
  if (e.key === "Backspace" || e.key === "Delete") {
    handleSpecialOp(e.key);
  } else {
    handleDisplay(e.key);
  }
}); 


// MAIN FUNCTIONS
// handles click events on both physical keyboard and the screen keyboard
function handleDisplay(key) {
  const isZero = inputEl.innerText == "0"; //Checks if the current key is 0 or not
  const isOperator = "+-*/".includes(key); //Checks if the current key is OPERATOR or not
  const isDoubleOp = "+-*/".includes(lastChar) && isOperator; //Checks if the current AND the last key is OPERATOR or not
  if (isDoubleOp) return;  // Prevents operators being used multiple times
  if (key == "=" || key === "Enter") {
    if (!result) {
      calculate();
    }
  } else {
    // If the key is not "==" NOR "Enter"
    if (result) {
      // If there are some value in the result string, this block is implemented

      if (isOperator && result != "error") {
        // If the current key is operator key AND the result is not error, this block is implemented and the function stops
        // for example, the result = "9" and key is "+", new input field looks like "9+"
        inputEl.textContent = result + key;
        inputVal = result + key;
        lastChar = key;
        lastNum = "";
        result = "";
        resultEl.innerText = result;
        return;
      } else if (isOperator) {
        // this block initializes the input field with 0, if current key is operator
        inputVal = "0";
        inputEl.textContent = inputVal;
        lastChar = "";
        result = "";
        resultEl.innerText = result;
        return;
      }
      // if the result other than operator, input field is replaced by key and result get empty
      inputVal = key;
      inputEl.textContent = inputVal;
      lastChar = key;
      result = "";
      resultEl.innerText = "";
    } else if (key == "(" || key == ")") {
      handleParenthesis();
    } else { //If the result is empty, this else block is implemented
      if (!isOperator) { //This if-else statement handles to store the lastNumber
        lastNum += key;
      } else {
        lastNum = "";
      }
      //Below if block prevents error related to inverted value.
      // If last num has "-", it is definitely inverted.
      // As a result it is written (-9)9, and this is not a valid operation. So we have to add "*"
      if(!isOperator && lastNum.includes("-")){
        inputVal += "*";
      }
      // below if-statement changes the input value based on the key value
      if ((isZero && !isOperator && key != ".") || (isZero && key == "0")) {
        inputVal = key;
        inputEl.textContent = inputVal;
        lastChar = key;
      } else {
        inputVal += key;
        inputEl.textContent = inputVal;
        lastChar = key;
      }
    }
  }
}
// handleSpecialOp handles keys with special value. Keys on the screen is defined the same name as the keyboard keys in their data attribute. Based on the attribute value the operation is handled 
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
//Below function handles after "Enter" or "=" keys are clicked
function calculate() {
  //calculationDisplay displays data after deciding whether make it shorter or not
  function calculationDisplay() {
    let temp = String(result);
    const isPoint = temp.includes(".") && temp.length > 14;
    if (isPoint || temp.length > 14) {
      result = String(result.toPrecision(14));
      const isZero = Number(result.split(".")[1]) == 0;
      result = isZero? result.split(".")[0] : result;
    } else {
      result = temp;
    }

    resultEl.textContent = result;
  }

  //Program throws an error if there are parenthesis open. Below if block closes all parenthesis if there left open
  if (parenthesis != 0) {
    for (let i = 0; i < parenthesis; i++) {
      inputVal += ")";
      inputEl.textContent = inputVal;
    }
  }
  //Program also throws an error if the last char is operator. Below block of code determines if the last one is operator or not. If it is operator, if-block is implemented. There, operator gets removed. After, value is evaluated and calculationDisplay gets called. Else, value is just evaluated and calculationDisplay is called
  //Both, if and else blocks has try-catch blocks in case error might happen.
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
  parenthesis = 0;
}


//HELPER FUNCTIONS - functions that are inside of the main functions

// handleBackspace function removes the value from backwards. There is one parent if-else statement, handling based on result is not empty and it does not contain "error" string. If result is truthy and contains "error", input value is cleared, otherwise the value is deleted from backward to forward
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
      lastNum = findLastNumber(inputVal); // here is an important thing. we have to find the last number when backspacing.
    }
  }
}

// toggleNumber converts the negative number to positive, and vise versa.
function toggleNumber(num) {
  const invertNum = -1 * parseFloat(num);

  if (invertNum > 0) {
    let index = `(${lastNum})`.length * -1;
    inputVal = inputVal.slice(0, index) + invertNum;
    inputEl.textContent = inputVal;
    lastNum = String(invertNum);
  } else {
    let index = lastNum.length * -1;
    console.log(invertNum);
    inputVal = `${inputVal.slice(0, index)}(${invertNum})`;
    inputEl.textContent = inputVal;
    lastNum = String(invertNum);
  }
}


// handleParenthesis function deals with parenthesis. there is only one main if-else statement. The main algorithm is to open or close the parenthesis.

//One of the important thing in opening parenthesis is to define operator. For example 9(9) is not the same as 9*(9) in JS, that's why .eval() fails. 
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

//SIDE FUNCTIONS - functions that are inside of helper functions

// One of the main concept in entire program is last number. Last number is the number from the end to the left till the first operator. findLastNumber finds the last number when the value is backspaced. 
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

// below is by far the smallest function in this program, yet it is used quite a lot. For the sake of preventing repetition it was created. It just displays the input value and empties the last Number variable and assigns the respective parenthesis to the last character variable
function parenthesisDisplay(value, key) {
  inputEl.textContent = value;
  lastChar = key;
  lastNum = "";
}
