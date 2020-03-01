import {lex} from "./lex";
import {tokens_to_ast} from "./tokens_to_ast";

export function parse(string: string) {
    const tokens = lex(string);
    return tokens_to_ast(tokens);
}