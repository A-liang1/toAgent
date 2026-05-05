import { forwardRef, Module } from '@nestjs/common';
import { JobService } from './job.service';
import { ToolModule } from 'src/tool/tool.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [forwardRef(() => ToolModule), forwardRef(() => AiModule)],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
