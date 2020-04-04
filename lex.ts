export const T_PLUS = '+';
export const T_MINUS = '-';
export const T_STAR = '*';
export const T_NUMBER = 'NUMBER';
export const T_SEMICOLON = ';';
export const T_TYPE = 'TYPE';
export const T_EQUALS = '=';
export const T_IDENTIFIER = 'IDENTIFIER';

export interface Token {
    token: string;
    value?: string;
}

type tokenCreator = (matchingString: string) => Token;
type tokenDeclaration = [string | RegExp, null | tokenCreator]

const t = (token: string) => () => {
    return {
        token: token
    };
};
const tWithValue = (token: string) => (matchingString: string) => {
    return {
        token: token,
        value: matchingString
    };
};

const language: tokenDeclaration[] = [
    [' ', null],
    [';', t(T_SEMICOLON)],
    ['=', t(T_EQUALS)],
    ['*', t(T_STAR)],
    [/^-?\d+\.?\d*/, tWithValue(T_NUMBER)],
    ['+', t(T_PLUS)],
    ['-', t(T_MINUS)],
    [/^(int|char|float|bool)/, tWithValue(T_TYPE)],
    [/^\w+/, tWithValue(T_IDENTIFIER)],
];

export function lex(str: string): Token[] {
    const result = [];
    let i = 0;
    let matches;
    while (i < str.length) {
        let matchedSomething = false;
        for (let tokenDeclaration of language) {
            if (typeof tokenDeclaration[0] === 'string' && tokenDeclaration[0] === str[i]) {
                i++;
                if (tokenDeclaration[1] !== null) {
                    result.push(tokenDeclaration[1](str[i]))
                }
                matchedSomething = true;
                break;
            } else if (typeof tokenDeclaration[0] === 'object' && (matches = str.slice(i).match(tokenDeclaration[0]))) {
                i += matches[0].length;
                if (tokenDeclaration[1] !== null) {
                    result.push(tokenDeclaration[1](matches[0]))
                }
                matchedSomething = true;
                break;
            }
        }
        if (!matchedSomething) {
            // bad .. do something better
            i++;
        }
    }
    return result;
}
