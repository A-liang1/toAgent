import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RunnableMap, RunnableLambda } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const addOne = RunnableLambda.from((input) => input.num + 1);
const multiplyTwo = RunnableLambda.from((input) => input.num * 2);
const square = RunnableLambda.from((input) => input.num * input.num);

const greetTemplate = PromptTemplate.fromTemplate('你好，{name}！');
const weatherTemplate = PromptTemplate.fromTemplate('今天天气{weather}。');

const runnableMap = RunnableMap.from({
  add: addOne,
  multiply: multiplyTwo,
  square: square,

  greeting: greetTemplate,
  weather: weatherTemplate,
});

const input = {
  name: '神光',
  weather: '多云',
  num: 5,
};

const result = await runnableMap.invoke(input);
console.log(result);