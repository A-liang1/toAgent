import { ChatOpenAI } from '@langchain/openai';
export declare class AiService {
    private readonly queryUserTool;
    private readonly sendMailTool;
    private readonly webSearchTool;
    private readonly dbUsersCrudTool;
    private readonly cronJobTool;
    private readonly modelWithTools;
    constructor(model: ChatOpenAI, queryUserTool: any, sendMailTool: any, webSearchTool: any, dbUsersCrudTool: any, cronJobTool: any);
    runChain(query: string): Promise<string>;
    runChainStream(query: string): AsyncIterable<string>;
}
