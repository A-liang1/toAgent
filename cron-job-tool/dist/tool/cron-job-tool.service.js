"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobToolService = void 0;
const common_1 = require("@nestjs/common");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const job_service_1 = require("../job/job.service");
let CronJobToolService = class CronJobToolService {
    tool;
    jobService;
    constructor() {
        const cronJobArgsSchema = zod_1.z.object({
            action: zod_1.z
                .enum(['list', 'add', 'toggle'])
                .describe('要执行的操作：list、add、toggle'),
            id: zod_1.z.string().optional().describe('任务 ID（toggle 时需要）'),
            enabled: zod_1.z
                .boolean()
                .optional()
                .describe('是否启用（toggle 可选；不传则自动取反）'),
            type: zod_1.z
                .enum(['cron', 'every', 'at'])
                .optional()
                .describe('任务类型（add 时需要）：cron（按 Cron 表达式循环执行）/ every（按固定间隔毫秒循环执行）/ at（在指定时间点执行一次，执行后自动停用）'),
            instruction: zod_1.z
                .string()
                .optional()
                .describe('任务说明/指令（add 时需要）。要求：\n1) 从用户自然语言中去掉“什么时候执行”的定时部分后，保留纯粹要执行的任务内容。\n2) 必须是自然语言描述，不能是工具调用或代码（例如不能写 send_mail(...) / db_users_crud(...) / web_search(...)）。\n3) 不要擅自补全细节或改写成脚本。'),
            cron: zod_1.z
                .string()
                .optional()
                .describe('Cron 表达式（type=cron 时需要，例如 */5 * * * * *）'),
            everyMs: zod_1.z
                .number()
                .int()
                .positive()
                .optional()
                .describe('固定间隔毫秒（type=every 时需要，例如 60000 表示每分钟执行一次）'),
            at: zod_1.z
                .string()
                .optional()
                .describe('指定触发时间点（type=at 时需要，ISO 字符串，例如 2026-03-18T12:34:56.000Z；到点执行一次后自动停用）'),
        });
        this.tool = (0, tools_1.tool)(async ({ action, id, enabled, type, instruction, cron, everyMs, at, }) => {
            switch (action) {
                case 'list': {
                    const jobs = await this.jobService.listJobs();
                    if (!jobs.length)
                        return '当前没有任何定时任务。';
                    const lines = jobs
                        .map((j) => {
                        return `id=${j.id} type=${j.type} enabled=${j.isEnabled} running=${j.running} cron=${j.cron ?? ''} everyMs=${j.everyMs ?? ''} at=${j.at instanceof Date ? j.at.toISOString() : (j.at ?? '')} instruction=${j.instruction ?? ''}`;
                    })
                        .join('\n');
                    return `当前定时任务列表（type 说明：cron=按表达式循环；every=按间隔循环；at=到点执行一次后自动停用）：\n${lines}`;
                }
                case 'add': {
                    if (!type)
                        return '新增任务需要提供 type（cron/every/at）。';
                    if (!instruction)
                        return '新增任务需要提供 instruction。';
                    if (type === 'cron') {
                        if (!cron)
                            return 'type=cron 时需要提供 cron。';
                        const created = await this.jobService.addJob({
                            type,
                            instruction,
                            cron,
                            isEnabled: true,
                        });
                        return `已新增定时任务：id=${created.id} type=cron cron=${created.cron} enabled=${created.isEnabled}`;
                    }
                    if (type === 'every') {
                        if (typeof everyMs !== 'number' || everyMs <= 0) {
                            return 'type=every 时需要提供 everyMs（正整数，单位毫秒）。';
                        }
                        const created = await this.jobService.addJob({
                            type,
                            instruction,
                            everyMs,
                            isEnabled: true,
                        });
                        return `已新增定时任务：id=${created.id} type=every everyMs=${created.everyMs} enabled=${created.isEnabled}`;
                    }
                    if (type === 'at') {
                        if (!at)
                            return 'type=at 时需要提供 at（ISO 时间字符串）。';
                        const date = new Date(at);
                        if (Number.isNaN(date.getTime())) {
                            return 'type=at 的 at 不是合法的 ISO 时间字符串。';
                        }
                        const created = await this.jobService.addJob({
                            type,
                            instruction,
                            at: date,
                            isEnabled: true,
                        });
                        return `已新增定时任务：id=${created.id} type=at at=${created.at?.toISOString?.() ?? ''} enabled=${created.isEnabled}`;
                    }
                    return `不支持的任务类型: ${type}`;
                }
                case 'toggle': {
                    if (!id)
                        return 'toggle 任务需要提供 id。';
                    const updated = await this.jobService.toggleJob(id, enabled);
                    return `已更新任务状态：id=${updated.id} enabled=${updated.isEnabled}`;
                }
                default:
                    return `不支持的操作: ${action}`;
            }
        }, {
            name: 'cron_job',
            description: '管理服务端定时任务（支持 list/add/toggle）。\n\n类型语义：\n- type=at：到指定时间点只执行一次，执行后自动停用。\n- type=every：按固定毫秒间隔循环执行。\n- type=cron：按 Cron 表达式循环执行。\n',
            schema: cronJobArgsSchema,
        });
    }
};
exports.CronJobToolService = CronJobToolService;
__decorate([
    (0, common_1.Inject)(job_service_1.JobService),
    __metadata("design:type", job_service_1.JobService)
], CronJobToolService.prototype, "jobService", void 0);
exports.CronJobToolService = CronJobToolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CronJobToolService);
//# sourceMappingURL=cron-job-tool.service.js.map