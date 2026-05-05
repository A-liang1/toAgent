import { ChatOpenAI } from '@langchain/openai';
export declare class JobAgentService {
    private readonly sendMailTool;
    private readonly webSearchTool;
    private readonly dbUsersCrudTool;
    private readonly timeNowTool;
    private readonly logger;
    private readonly modelWithTools;
    constructor(model: ChatOpenAI, sendMailTool: any, webSearchTool: any, dbUsersCrudTool: any, timeNowTool: any);
    runJob(instruction: string): Promise<string>;
}
