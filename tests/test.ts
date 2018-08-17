import {parseExpression, parseStatement} from '../parser';

describe('parseExpression()', () => {
    it('1 + 5', () => {
        expect(parseExpression('1 + 5')).toEqual([{ type: 'add', operands: [1, 5] }, 5]);
    });
    it('1   +   5  ', () => {
        expect(parseExpression('1   +   5  ')).toEqual([{ type: 'add', operands: [1, 5] }, 9]);
    });
    it('1 + 5 + 2', () => {
        expect(parseExpression('1 + 5 + 2')).toEqual([{ type: 'add', operands: [1, 5, 2] }, 9]);
    });
    it('1 + 5 + 2 + 9', () => {
        expect(parseExpression('1 +  5+2+   9')).toEqual([{ type: 'add', operands: [1, 5, 2, 9]}, 13]);
    });

    it('1 - 5', () => {
        expect(parseExpression('1 - 5')).toEqual([{ type: 'subtract', operands: [1, 5] }, 5]);
    });
    it('1 - 5 - 10', () => {
        expect(parseExpression('1 - 5 - 10')).toEqual([{ type: 'subtract', operands: [1, 5, 10] }, 10]);
    });

    it('1 - 5 + 10', () => {
        expect(parseExpression('1 - 5 + 10')).toEqual([{ type: 'subtract', operands: [1, { type: 'add', operands: [5, 10] }] }, 10]);
    });
    it('1 + 5 - 10', () => {
        expect(parseExpression('1 + 5 - 10')).toEqual([{ type: 'add', operands: [1, { type: 'subtract', operands: [5, 10] }] }, 10]);
    });
    it('1 + 2 - 3 + 4', () => {
        expect(parseExpression('1 + 2 - 3 + 4')).toEqual([{"operands": [1, {"operands": [2, {"operands": [3, 4], "type": "add"}], "type": "subtract"}], "type": "add"}, 13]);
    });

    it('1 + 3 * 7', () => {
        expect(parseExpression('1 + 3 * 7')).toEqual([{ type: 'add', operands: [1, { type: 'multiply', operands: [3, 7] }] }, 9]);
    });
    it('3 * 2 + 1', () => {
        expect(parseExpression('3 * 2 + 1')).toEqual([{ type: 'add', operands: [{ type: 'multiply', operands: [3, 2] }, 1] }, 9]);
    });
    it('1 * 8 + 3 * 7', () => {
        expect(parseExpression('1 * 8 + 3 * 7')).toEqual([{ type: 'add', operands: [{ type: 'multiply', operands: [1, 8] }, { type: 'multiply', operands: [3, 7] }] }, 13]);
    });
});


describe('parseStatement()', () => {
    it('1 + 5;', () => {
        expect(parseStatement('1 + 5;'))
            .toEqual([{ type: 'statement',
            content: { type: 'add', operands: [1, 5] } }, 6]);
    });
    it('1000   +52   ;', () => {
        expect(parseStatement('1000   +52   ;')).toEqual([{ type: 'statement',
            content: { type: 'add', operands: [1000, 52] } }, 14]);
    });
});