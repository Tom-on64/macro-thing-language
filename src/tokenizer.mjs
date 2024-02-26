import { error } from "./main.mjs";

/* enum TokenType { */ let __index__ = 0;
    export const EOF = __index__++;
    export const HASH = __index__++;
    export const IDENT = __index__++;
    export const VALUE = __index__++;
    export const CHAR = __index__++;
    export const STRING = __index__++;
    export const INT = __index__++;
    export const FLOAT = __index__++;
// };

const Token = (type, value) => ({ type, value: (value == undefined ? null : value) });

export class Tokenizer {
    current() {
        if (this.index > this.input.length) return null;
        return this.input[this.index];
    }

    consume() {
        if (this.index + 1 > this.input.length) return null;
        return this.input[this.index++];
    }

    nextToken() {
        const c = this.consume();
        if (c.match(/\s/)) return;
        else if (c.match(/[A-Za-z_]/)) {
            let ident = "" + c;
            while (this.current().match(/[A-Za-z0-9_]/)) {
                ident += this.consume();
            }

            return Token(IDENT, ident);
        } else if (c === '(') {
            let value = "";
            let nest = 0;
            while (this.current() != ')' && nest == 0) {
                let c = this.consume();

                if (c == '\\') c = this.consume();
                else if (c == '(') nest++;
                else if (c == ')') nest--;
                
                value += c;
            }

            return Token(VALUE, value);
        } else if (c.match(/[0-9\-]/)) {
            let num = c;
            
            let float = false;
            let first = true;
            let negative = c == '-';
            while (this.current().match(/[0-9.]/)) {
                if (negative && first && this.current() === '.') error("Expected digit after '-'!");
                if (float && this.current() === '.') error("Unexpected second decimal point!");

                if (this.current() === '.') float = true;

                num += this.consume();

                if (first) first = false;
            }

            if (float) return Token(FLOAT, parseFloat(num));
            else return Token(INT, parseInt(num));
        } else if (c === '"') {
            let string = "" + c;

            while (this.current() !== '"') {
                console.log(this.current());
                if (this.current() === '\\') this.consume();

                string += this.consume();
            }

            return Token(STRING, string);
        } else if (c === '\'') {
            const char = this.consume();
            if (this.consume() !== '\'') error("Expected closing quote after character!");
            return Token(CHAR, char);
        } else if (c === '#') return Token(HASH);
    }

    tokenize(code) {
        this.input = code.split('');
        this.index = 0;

        const out = [];

        while (this.index < code.length) {
            const t = this.nextToken();
            if (!t) continue;
            
            out.push(t);
        }

        out.push(Token(EOF));

        return out;
    }
}
