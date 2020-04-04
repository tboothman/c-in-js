import {parse} from './parser';

const input = `5 + 1 + 1;`;

const tokens = parse('1 + 2;');
console.log(tokens);