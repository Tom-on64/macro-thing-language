import { error, tokenizer } from "./main.mjs";
import { EOF, HASH, IDENT, VALUE } from "./tokenizer.mjs";


export const preprocess = (t, ctx = {}) => {
    const def = ctx;

    let out = "";

    let i = 0;
    while (t[i].type !== EOF) {
        if (t[i].type === HASH) {
            const cmd = t[++i];

            if (cmd.type !== IDENT) error("Expected identifier after '#'!");

            if (cmd.value === "def") {
                const ident = t[++i];
                if (ident.type !== IDENT) error("Expected identifier after define command!");
                const val = t[++i];
                if (val.type !== VALUE) error("Expected value after define command!");

                def[ident.value] = preprocess(tokenizer.tokenize(val.value), def);

                i++;
            } else error(`Unknown command '#${cmd.value}'!`)
        } else if (t[i].type === IDENT) {
            const tkn = t[i++];
            if (def[tkn.value]) out += def[tkn.value];
            else out += tkn.value;
        } else {
            out += t[i++].value
        }
    }

    return out;
}