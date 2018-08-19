const buttons = document.querySelectorAll(".displayValue"),
      clearBtn = document.querySelector("#clear"),
      equalsBtn = document.querySelector("#equals"),
      display = document.querySelector("#display p"),
      decimalBtn = document.querySelector("#decimal");
let equation = [],
    prevError = false;
    

buttons.forEach(
    button => button.addEventListener("click", function(){
        let value;
        
        if(this.id === "decimal") {
            decimalBtn.disabled = true;
        }
        if(this.id === "add" ||
           this.id === "subtract" ||
           this.id === "multiply" ||
           this.id === "divide"){
           value = " " + this.textContent + " ";
            decimalBtn.disabled = false;
        } else {
            checkForPreviousError();
            checkForPreviousEquals();
            value = this.textContent;
        }
        populateDisplay(value);
        
        if(equalsBtn.disabled) equalsBtn.disabled = false;
    })
);

clearBtn.addEventListener("click", function(){
    clearAll();
});

equalsBtn.addEventListener("click", function(){
    let solution;
    equation = display.textContent.split(" ");
    
    if( checkForError(equation) ) { /* error */ }
    else {
        orderOperations();
        solution = Number(equation.join());
    
        if(!solution.isInteger)
            solution.toFixed(4);
        
        displayResult(solution);
        equalsBtn.disabled = true;
    }
    
});

function orderOperations(){
    for(i = 0; i < equation.length - 1; i++) {
        let num;
        if(equation[i] === "*" || equation[i] === "/") {
            if(equation[i] === "*") {
                num = multiply(equation[i-1], equation[i+1]);
                equation.splice(i-1, 3, num);
            } else {
                num = divide(equation[i-1], equation[i+1]);
                equation.splice(i-1, 3, num);
            }
            orderOperations(); // runs until no more * or /
        } 
    } //end for
    
    for(i = 0; i < equation.length - 1; i++) {
        let num;
        if(equation[i] === "+" || equation[i] === "-") {
            if(equation[i] === "+") {
                num = add(equation[i-1], equation[i+1]);
                equation.splice(i-1, 3, num);
            } else {
                num = subtract(equation[i-1], equation[i+1]);
                equation.splice(i-1, 3, num);
            }
        }
    } //end for
}


function populateDisplay(clickedButton) {
    display.textContent += clickedButton;
}

function displayResult(result){
    display.textContent = result;
    
}

function operate(operator, num1, num2) {
    switch(operator) {
        case "+":
            return add(num1,num2);
        case "-":
            return subtract(num1,num2);
        case "*":
            return multiply(num1,num2);
        case "/":
            return divide(num1,num2);
    }
}

function add(...args) {
    let operands = args,
        sum = 0;
    
    operands.forEach(
        operand => {
            sum += Number(operand);
        }
    );
    
    return sum;
}

function subtract(...args) {
    let diff = args[0],
        operands = args.splice(1);
    
    
    operands.forEach(
        operand => {
            diff -= operand;
        }
    );
    
    return diff;
}

function multiply(...args) {
    let product = args[0],
        operands = args.splice(1);
    
    operands.forEach(
        operand => {
            product *= operand;
        }
    );
    
    return product;
}

function divide(...args) {
    let quotient = args[0],
        operands = args.splice(1);
    
    operands.forEach(
        operand => {
            quotient /= operand;
        }
    );
    
    return quotient;
}

function clearAll(){
    clearDisplay();
    equation = [];
}

function clearDisplay(){
    display.textContent = "";
}

function checkForError(equation) {
    let eq = equation,
        errorMessage,
        errorType = -1;
    
    if(eq[eq.indexOf("/") + 1] == 0) errorType = 0;
    if( eq[0] === "" ) errorType = 1; // eq starts with operator
    if( eq[eq.length - 1] === "" ) {errorType = 1;} //eq ends with operator
        else if( eq.indexOf("") > -1 ) errorType = 2; //two operators in a row, except at the end of the equation
    if(eq.length <= 1 && eq[0] === "") errorType = 3; //equals button pressed first
    
    switch(errorType){
        case 0:
            errorMessage = "Cannot divide by 0";
            break;
        case 1:
            errorMessage = "Must start and end with a number";
            break;
        case 2:
            errorMessage = "Cannot have two operators in a row";
            break;
        case 3:
            errorMessage = "EQUALS PRESSED FIRST";
            break;
    }
    
    if(errorType > -1) prevError = true;
    display.textContent = errorMessage;
    return prevError;
}

function checkForPreviousError(){
    if(prevError) {
        clearAll();
        prevError = false;
    }
}

function checkForPreviousEquals(){
    if(equalsBtn.disabled) {
        clearAll();
    }
}
