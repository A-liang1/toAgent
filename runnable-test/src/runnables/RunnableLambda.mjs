import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const addOne = RunnableLambda.from((input) => {
  console.log(`输入: ${input}`);
  return input + 1;
});

const multiplyTwo = RunnableLambda.from((input) => {
  console.log(`输入: ${input}`);
  return input * 2;
});

const chain = RunnableSequence.from([
  addOne,
  multiplyTwo,
  addOne,
]);

const result = await chain.invoke(5);
console.log(result);