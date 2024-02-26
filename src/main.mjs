import { preprocess } from "./process.mjs";
import { Tokenizer } from "./tokenizer.mjs";

export const error = (msg) => {
    console.log(`Error: \x1b[31m${msg}\x1b[0m`);
    process.exit(1);
}

const code = `
#def A ("Hello,")
#def SPACE (' ')
#def B ("World!")

A SPACE B
`

const tokenizer = new Tokenizer();
console.log(tokenizer.tokenize(code));
console.log(preprocess(tokenizer.tokenize(code)));
