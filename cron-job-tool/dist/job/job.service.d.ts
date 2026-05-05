import { OnApplicationBootstrap } from '@nestjs/common';
import { Job } from './entities/job.entity';
export declare class JobService implements OnApplicationBootstrap {
    private readonly logger;
    private readonly entityManager;
    private readonly schedulerRegistry;
    private readonly jobAgentService;
    onApplicationBootstrap(): Promise<void>;
    listJobs(): Promise<{
        running: boolean;
        id: string;
        instruction: string;
        type: import("./entities/job.entity").JobType;
        cron: string | null;
        everyMs: number | null;
        at: Date | null;
        isEnabled: boolean;
        lastRun: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    addJob(input: {
        type: 'cron';
        instruction: string;
        cron: string;
        isEnabled?: boolean;
    } | {
        type: 'every';
        instruction: string;
        everyMs: number;
        isEnabled?: boolean;
    } | {
        type: 'at';
        instruction: string;
        at: Date;
        isEnabled?: boolean;
    }): Promise<Job>;
    toggleJob(jobId: string, enabled?: boolean): Promise<Job>;
    private startRuntime;
    private stopRuntime;
    private createCronJob;
}
