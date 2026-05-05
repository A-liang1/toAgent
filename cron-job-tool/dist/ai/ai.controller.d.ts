import { AiService } from './ai.service';
import { Observable } from 'rxjs';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    chat(query: string): Promise<{
        answer: string;
    }>;
    chatStream(query: string): Observable<MessageEvent>;
}
