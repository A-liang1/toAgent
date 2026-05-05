import { OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
export declare class AppModule implements OnApplicationBootstrap {
    schedulerRegistry: SchedulerRegistry;
    onApplicationBootstrap(): Promise<void>;
}
