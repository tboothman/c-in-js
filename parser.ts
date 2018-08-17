type Add = {
    type: 'add',
    operands: Expression[],
}

type Subtract = {
    type: 'subtract',
    operands: Expression[],
}

type Multiply = {
    type: 'multiply',
    operands: number[],
}

type Expression = Add | Subtract | Multiply | number;

type Statement = {
    type: 'statement',
    content: Expression
}

// type Program = {
//     type: 'program',
//     statements: Statement[]
// }

function parseNumber(str: string): [number, number] | false {
    let matches;
    if (matches = str.match(/^-?\d+\.?\d*/)) {
        return [parseFloat(matches[0]), matches[0].length];
    } else {
        return false;
    }
}

export function parseExpression(str: string): [Expression, number] | false {
    return parseAdd(str) || parseSubtract(str) || parseNumber(str);
}

function parseAdd(str: string): [Add, number] | false {
    let operands: Expression[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseMultiply(str.slice(i)) || parseNumber(str.slice(i));
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < str.length) {
        i = absorbWhitespace(str, i);
        if (str[i] !== '+') break;
        i++;
        i = absorbWhitespace(str, i);
        let operand = parseSubtract(str.slice(i)) || parseMultiply(str.slice(i)) || parseNumber(str.slice(i));
        if (!operand) break;
        i += operand[1];
        operands.push(operand[0]);
        validOffset = i;
    }

    if (validOffset) {
        return [{
            type: 'add',
            operands: operands,
        }, validOffset];
    } else {
        return false;
    }
}

function parseSubtract(str: string): [Subtract, number] | false {
    let operands: Expression[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseMultiply(str.slice(i)) || parseNumber(str.slice(i));
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < str.length) {
        i = absorbWhitespace(str, i);
        if (str[i] !== '-') break;
        i++;
        i = absorbWhitespace(str, i);
        let operand = parseAdd(str.slice(i)) || parseMultiply(str.slice(i)) || parseNumber(str.slice(i));
        if (!operand) break;
        i += operand[1];
        operands.push(operand[0]);
        validOffset = i;
    }

    if (validOffset) {
        return [{
            type: 'subtract',
            operands: operands,
        }, validOffset];
    } else {
        return false;
    }
}

export function parseMultiply(str: string): [Multiply, number] | false {
    let operands: number[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseNumber(str.slice(i));
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < str.length) {
        i = absorbWhitespace(str, i);
        if (str[i] !== '*') break;
        i++;
        i = absorbWhitespace(str, i);
        let operand = parseNumber(str.slice(i));
        if (!operand) break;
        i += operand[1];
        operands.push(operand[0]);
        validOffset = i;
    }

    if (validOffset) {
        return [{
            type: 'multiply',
            operands: operands,
        }, validOffset];
    } else {
        return false;
    }
}

/**
 * Move the string from the current offset and return a new offset for the character after the whitespace
 */
function absorbWhitespace(str: string, offset: number): number {
    let i = offset;
    while (i < str.length) {
        if (str[i] === ' ') {
            i++;
        } else {
            break;
        }
    }
    return i;
}

// Add Semicolon
export function parseStatement(str: string): [Statement, number] | false {
    let i = 0;
    while (i < str.length) {
        if (str[i] === ' ') {
            i++;
            continue;
        }
        let x = parseAdd(str.slice(i));
        if (x) {
            i += x[1];
            i = absorbWhitespace(str, i);
            if (str[i] !== ';') {
                throw new Error('Expected ; after' + str.slice(0, i-1));
            }
            i++;
            return [{
                type: 'statement',
                content: x[0]
            }, i];
        } else {
            console.log(str);
            console.log(i);
            throw new Error('Parse Error: OK:' + str.slice(0, i-1) + ' Not OK:' + str.slice(i));
        }
    }

    return false;
}

export default function parse(input: string): Statement {
    const x = parseStatement(input);
    if (!x) {
        throw new Error('Failed to parse: ' + input);
    }

    return x[0];
}