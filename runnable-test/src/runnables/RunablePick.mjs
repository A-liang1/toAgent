import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RunnablePick, RunnableSequence } from '@langchain/core/runnables';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const inputData = {
  name: '神光',
  age: 30,
  city: '北京',
  country: '中国',
  email: 'shenguang@example.com',
  phone: '+86-13800138000',
};

const chain = RunnableSequence.from([
  (input) => ({
    ...input,
    fullInfo: `${input.name}，${input.age}岁，来自${input.city}`,
  }),
  new RunnablePick(['name', 'fullInfo']),
]);

const result = await chain.invoke(inputData);
console.log(result);