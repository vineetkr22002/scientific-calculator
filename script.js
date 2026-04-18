class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.scientificMode = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && this.previousOperand === '') return;
        if (this.currentOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getScientificResult(key) {
        const num = parseFloat(this.currentOperand);
        if (isNaN(num)) return;

        switch (key) {
            case 'sin':
                return Math.sin(num * Math.PI / 180).toFixed(8);
            case 'cos':
                return Math.cos(num * Math.PI / 180).toFixed(8);
            case 'tan':
                return Math.tan(num * Math.PI / 180).toFixed(8);
            case 'log':
                return num > 0 ? Math.log10(num).toFixed(8) : 'Error';
            case 'sqrt':
                return num >= 0 ? Math.sqrt(num).toFixed(8) : 'Error';
            case 'pi':
                this.appendNumber(Math.PI);
                return;
            case 'factorial':
                return this.factorial(num);
            default:
                return num;
        }
    }

    factorial(n) {
        if (n < 0) return 'Error';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result.toString();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = Math.abs(integerDigits).toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    toggleScientificMode() {
        this.scientificMode = !this.scientificMode;
        // Hide/show scientific buttons (CSS handles this)
        document.body.classList.toggle('scientific-active', this.scientificMode);
    }
}

const previousOperandTextElement = document.getElementById('previousOperand');
const currentOperandTextElement = document.getElementById('currentOperand');
const scientificModeToggle = document.getElementById('scientificMode');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) calculator.appendNumber(e.key);
    if (e.key === '.') calculator.appendNumber('.');
    if (e.key === '+' || e.key === '-') calculator.chooseOperation(e.key);
    if (e.key === '*') calculator.chooseOperation('×');
    if (e.key === '/') calculator.chooseOperation('÷');
    if (e.key === 'Enter' || e.key === '=') calculator.compute();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
    calculator.updateDisplay();
});

['clear', 'clearEntry', 'delete'].forEach(key => {
    document.querySelector(`[data-key="${key}"]`).addEventListener('click', () => {
        if (key === 'clear') calculator.clear();
        if (key === 'clearEntry') calculator.currentOperand = '';
        if (key === 'delete') calculator.delete();
        calculator.updateDisplay();
    });
});

document.querySelector('[data-key="equals"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

scientificModeToggle.addEventListener('change', () => {
    calculator.toggleScientificMode();
});

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.key);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.operation').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.key);
        calculator.updateDisplay();
    });
});

// Scientific functions
document.querySelectorAll('.scientific').forEach(button => {
    button.addEventListener('click', () => {
        const key = button.dataset.key;
        if (key === 'pi') {
            calculator.appendNumber(Math.PI.toFixed(8));
        } else {
            const result = calculator.getScientificResult(key);
            if (result !== undefined) {
                calculator.currentOperand = result;
            }
        }
        calculator.updateDisplay();
    });
});