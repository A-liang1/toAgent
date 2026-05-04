import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

const schema = z.object({
  translation: z.string().describe('翻译后的英文文本'),
  keywords: z.array(z.string()).length(3).describe('3个关键词'),
});

const outputParser = StructuredOutputParser.fromZodSchema(schema);

const promptTemplate = PromptTemplate.fromTemplate(
  '将以下文本翻译成英文，然后总结为3个关键词。\n\n文本：{text}\n\n{format_instructions}'
);

// 使用 runnable 
const chain = RunnableSequence.from([
  promptTemplate,
  model,
  outputParser,
]);
// ===== 不使用 RunnableSequence 的写法 =====
// // 步骤1: 格式化提示词
// const prompt = await promptTemplate.format(input);
// // 步骤2: 调用模型
// const response = await model.invoke(prompt);
// // 步骤3: 解析输出
// const result = await outputParser.parse(response.content);

const input = {
  text: 'LangChain 是一个强大的 AI 应用开发框架',
  format_instructions: outputParser.getFormatInstructions(),
};

const result = await chain.invoke(input);

console.log('✅ 最终结果:');
console.log(result);