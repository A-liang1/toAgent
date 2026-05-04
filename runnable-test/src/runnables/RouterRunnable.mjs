import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { RouterRunnable, RunnableLambda } from '@langchain/core/runnables';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const toUpperCase = RunnableLambda.from((text) => text.toUpperCase());
const reverseText = RunnableLambda.from((text) => text.split('').reverse().join(''));

const router = new RouterRunnable({
  runnables: {
    toUpperCase,
    reverseText,
  },
});

const result1 = await router.invoke({ key: 'reverseText', input: 'Hello World' });
console.log('reverseText 结果:', result1);

const result2 = await router.invoke({ key: 'toUpperCase', input: 'Hello World' });
console.log('toUpperCase 结果:', result2);