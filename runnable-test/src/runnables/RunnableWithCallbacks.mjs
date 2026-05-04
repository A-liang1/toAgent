import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const clean = RunnableLambda.from((text) => {
  return text.trim().replace(/\s+/g, ' ');
});

const tokenize = RunnableLambda.from((text) => {
  return text.split(' ');
});

const count = RunnableLambda.from((tokens) => {
  return { tokens, wordCount: tokens.length };
});

const chain = RunnableSequence.from([clean, tokenize, count]);

const callback = {
  handleChainStart(chain) {
    const step = chain?.id?.[chain.id.length - 1] ?? 'unknown';
    console.log(`[START] ${step}`);
  },
  handleChainEnd(output) {
    console.log(`[END]   output=${JSON.stringify(output)}\n`);
  },
  handleChainError(err) {
    console.log(`[ERROR] ${err.message}\n`);
  },
};

const result = await chain.invoke('  hello   world   from   langchain  ', {
  callbacks: [callback],
});

console.log('结果:', result);