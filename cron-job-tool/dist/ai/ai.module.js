"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const ai_controller_1 = require("./ai.controller");
const zod_1 = require("zod");
const tools_1 = require("@langchain/core/tools");
const user_service_1 = require("./user.service");
const users_module_1 = require("../users/users.module");
const tool_module_1 = require("../tool/tool.module");
const job_agent_service_1 = require("./job-agent.service");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, tool_module_1.ToolModule],
        controllers: [ai_controller_1.AiController],
        providers: [
            ai_service_1.AiService,
            user_service_1.UserService,
            job_agent_service_1.JobAgentService,
            {
                provide: 'QUERY_USER_TOOL',
                useFactory: (userService) => {
                    const queryUserArgsSchema = zod_1.z.object({
                        userId: zod_1.z.string().describe('用户 ID，例如: 001, 002, 003'),
                    });
                    return (0, tools_1.tool)(async ({ userId }) => {
                        const user = userService.findOne(userId);
                        if (!user) {
                            const availableIds = userService
                                .findAll()
                                .map((u) => u.id)
                                .join(', ');
                            return `用户 ID ${userId} 不存在。可用的 ID: ${availableIds}`;
                        }
                        return `用户信息：\n- ID: ${user.id}\n- 姓名: ${user.name}\n- 邮箱: ${user.email}\n- 角色: ${user.role}`;
                    }, {
                        name: 'query_user',
                        description: '查询数据库中的用户信息。输入用户 ID，返回该用户的详细信息（姓名、邮箱、角色）。',
                        schema: queryUserArgsSchema,
                    });
                },
                inject: [user_service_1.UserService],
            },
        ],
        exports: [job_agent_service_1.JobAgentService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map