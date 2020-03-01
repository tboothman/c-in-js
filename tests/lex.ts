import {lex, T_EQUALS, T_IDENTIFIER, T_MINUS, T_NUMBER, T_PLUS, T_SEMICOLON, T_TYPE} from "../lex";

describe('lex()', () => {
    it('tokenises a +', () => {
        expect(lex('+')).toStrictEqual([{
            token: T_PLUS
        }]);
    });
    it('tokenises a + with whitespace', () => {
        expect(lex(' +     ')).toStrictEqual([{
            token: T_PLUS
        }]);
    });
    it('tokenises a -', () => {
        expect(lex('-')).toStrictEqual([{
            token: T_MINUS
        }]);
    });
    it('tokenises a number', () => {
        expect(lex('1')).toStrictEqual([{
            token: T_NUMBER,
            value: '1'
        }]);
    });
    it('tokenises a negative number', () => {
        expect(lex('-1')).toStrictEqual([{
            token: T_NUMBER,
            value: '-1'
        }]);
    });
    it('tokenises a long number', () => {
        expect(lex('1234567')).toStrictEqual([{
            token: T_NUMBER,
            value: '1234567'
        }]);
    });
    it('tokenises a float number', () => {
        expect(lex('1234567.890')).toStrictEqual([{
            token: T_NUMBER,
            value: '1234567.890'
        }]);
    });
    it('tokenises addition', () => {
        expect(lex('1.5 + -2')).toStrictEqual([{
            token: T_NUMBER,
            value: '1.5'
        }, {
            token: T_PLUS
        }, {
            token: T_NUMBER,
            value: '-2'
        }]);
    });
    it('tokenises some maths', () => {
        expect(lex('1.5+ -2.00 - -5;')).toStrictEqual([{
            token: T_NUMBER,
            value: '1.5'
        }, {
            token: T_PLUS
        }, {
            token: T_NUMBER,
            value: '-2.00'
        }, {
            token: T_MINUS
        }, {
            token: T_NUMBER,
            value: '-5'
        }, {
            token: T_SEMICOLON
        }]);
    });
    it('tokenises declaring an integer with a value', () => {
        expect(lex('int test = 5;')).toStrictEqual([{
            token: T_TYPE,
            value: 'int'
        }, {
            token: T_IDENTIFIER,
            value: 'test'
        }, {
            token: T_EQUALS
        }, {
            token: T_NUMBER,
            value: '5'
        }, {
            token: T_SEMICOLON
        }]);
    });
});
