import { expect } from 'chai';
import 'mocha';
import {lex, T_NUMBER, T_PLUS, T_SEMICOLON} from "../lex";
import {tokens_to_ast} from "../tokens_to_ast";

describe('tokens_to_ast()', () => {
    it('1.5 + -2;', () => {
        expect(tokens_to_ast([{
            token: T_NUMBER,
            value: '1.5'
        }, {
            token: T_PLUS
        }, {
            token: T_NUMBER,
            value: '-2'
        }, {
            token: T_SEMICOLON
        }])).to.deep.equal({type: 'statement', content: {type: 'add', operands: [1.5, -2]}});
    });
});