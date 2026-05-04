import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RunnableEach, RunnableLambda, RunnableSequence } from '@langchain/core/runnables';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const toUpperCase = RunnableLambda.from((input) => input.toUpperCase());
const addGreeting = RunnableLambda.from((input) => `你好，${input}！`);

const processItem = RunnableSequence.from([
  toUpperCase,
  addGreeting,
]);

const chain = new RunnableEach({
  bound: processItem,
});

const input = ['alice', 'bob', 'carol'];
const result = await chain.invoke(input);

console.log('✅ RunnableEach - 数组元素处理:');
console.log('输入:', input);
console.log('输出:', result);