// import {T_NUMBER, T_PLUS, Token} from "./lex";
//
// // add
// [T_NUMBER, T_PLUS, T_NUMBER];
//
//
// export function tokens_to_ast(tokens: Token[]) {
//     let i = 0;
//     switch (tokens[i].token) {
//         case T_NUMBER:
//             if (tokens[i++].token === T_PLUS) {
//
//             }
//     }
// }

import {T_MINUS, T_STAR, T_NUMBER, T_PLUS, T_SEMICOLON, Token} from "./lex";

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

function parseNumber(tokens: Token[]): [number, number] | false {
    const token = tokens[0];
    if (token.token === T_NUMBER) {
        return [parseFloat(token.value!), 1];
    } else {
        return false;
    }
}

export function parseExpression(tokens: Token[]): [Expression, number] | false {
    return parseAdd(tokens) || parseSubtract(tokens) || parseNumber(tokens);
}

function parseAdd(tokens: Token[]): [Add, number] | false {
    let operands: Expression[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseMultiply(tokens) || parseNumber(tokens);
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < tokens.length) {
        if (tokens[i].token !== T_PLUS) break;
        i++;
        let operand = parseSubtract(tokens.slice(i)) || parseMultiply(tokens.slice(i)) || parseNumber(tokens.slice(i));
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

function parseSubtract(tokens: Token[]): [Subtract, number] | false {
    let operands: Expression[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseMultiply(tokens.slice(i)) || parseNumber(tokens.slice(i));
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < tokens.length) {
        if (tokens[i].token !== T_MINUS) break;
        i++;
        let operand = parseAdd(tokens.slice(i)) || parseMultiply(tokens.slice(i)) || parseNumber(tokens.slice(i));
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

export function parseMultiply(tokens: Token[]): [Multiply, number] | false {
    let operands: number[] = [];
    let i = 0;
    let validOffset = i;
    let left = parseNumber(tokens.slice(i));
    if (!left) return false;
    i += left[1];
    operands.push(left[0]);
    while (i < tokens.length) {
        if (tokens[i].token !== T_STAR) break;
        i++;
        let operand = parseNumber(tokens.slice(i));
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

// Add Semicolon
export function parseStatement(tokens: Token[]): [Statement, number] | false {
    let i = 0;
    while (i < tokens.length) {
        let x = parseExpression(tokens.slice(i));
        if (x) {
            i += x[1];
            if (tokens[i].token !== T_SEMICOLON) {
                throw new Error('Expected ; after' + tokens.slice(0, i-1));
            }
            i++;
            return [{
                type: 'statement',
                content: x[0]
            }, i];
        } else {
            console.log(tokens);
            console.log(i);
            throw new Error('Parse Error: OK:' + tokens.slice(0, i-1) + ' Not OK:' + tokens.slice(i));
        }
    }

    return false;
}

export function tokens_to_ast(tokens: Token[]): Statement {
    const x = parseStatement(tokens);
    if (!x) {
        throw new Error('Failed to parse: ' + tokens);
    }

    return x[0];
}