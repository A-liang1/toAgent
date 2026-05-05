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
exports.DbUsersCrudToolService = void 0;
const common_1 = require("@nestjs/common");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const users_service_1 = require("../users/users.service");
let DbUsersCrudToolService = class DbUsersCrudToolService {
    tool;
    usersService;
    constructor() {
        const dbUsersCrudArgsSchema = zod_1.z.object({
            action: zod_1.z
                .enum(['create', 'list', 'get', 'update', 'delete'])
                .describe('要执行的操作：create、list、get、update、delete'),
            id: zod_1.z
                .number()
                .int()
                .positive()
                .optional()
                .describe('用户 ID（get / update / delete 时需要）'),
            name: zod_1.z
                .string()
                .min(1)
                .max(50)
                .optional()
                .describe('用户姓名（create 或 update 时可用）'),
            email: zod_1.z
                .email()
                .max(50)
                .optional()
                .describe('用户邮箱（create 或 update 时可用）'),
        });
        this.tool = (0, tools_1.tool)(async ({ action, id, name, email, }) => {
            switch (action) {
                case 'create': {
                    if (!name || !email) {
                        return '创建用户需要同时提供 name 和 email。';
                    }
                    const created = await this.usersService.create({ name, email });
                    return `已创建用户：ID=${created.id}，姓名=${created.name}，邮箱=${created.email}`;
                }
                case 'list': {
                    const users = await this.usersService.findAll();
                    if (!users.length) {
                        return '数据库中还没有任何用户记录。';
                    }
                    const lines = users
                        .map((u) => `ID=${u.id}，姓名=${u.name}，邮箱=${u.email}，创建时间=${u.createdAt?.toISOString?.() ?? ''}`)
                        .join('\n');
                    return `当前数据库 users 表中的用户列表：\n${lines}`;
                }
                case 'get': {
                    if (!id) {
                        return '查询单个用户需要提供 id。';
                    }
                    const user = await this.usersService.findOne(id);
                    if (!user) {
                        return `ID 为 ${id} 的用户在数据库中不存在。`;
                    }
                    const u = user;
                    return `用户信息：ID=${u.id}，姓名=${u.name}，邮箱=${u.email}，创建时间=${u.createdAt?.toISOString?.() ?? ''}`;
                }
                case 'update': {
                    if (!id) {
                        return '更新用户需要提供 id。';
                    }
                    const payload = {};
                    if (name !== undefined)
                        payload.name = name;
                    if (email !== undefined)
                        payload.email = email;
                    if (!Object.keys(payload).length) {
                        return '未提供需要更新的字段（name 或 email），本次不执行更新。';
                    }
                    const existing = await this.usersService.findOne(id);
                    if (!existing) {
                        return `ID 为 ${id} 的用户在数据库中不存在。`;
                    }
                    await this.usersService.update(id, payload);
                    const updated = await this.usersService.findOne(id);
                    return `已更新用户：ID=${id}，姓名=${updated?.name}，邮箱=${updated?.email}`;
                }
                case 'delete': {
                    if (!id) {
                        return '删除用户需要提供 id。';
                    }
                    const existing = await this.usersService.findOne(id);
                    if (!existing) {
                        return `ID 为 ${id} 的用户在数据库中不存在，无需删除。`;
                    }
                    await this.usersService.remove(id);
                    return `已删除用户：ID=${id}，姓名=${existing.name}，邮箱=${existing.email}`;
                }
                default:
                    return `不支持的操作: ${action}`;
            }
        }, {
            name: 'db_users_crud',
            description: '对数据库 users 表执行增删改查操作。通过 action 字段选择 create/list/get/update/delete，并按需提供 id、name、email 等参数。',
            schema: dbUsersCrudArgsSchema,
        });
    }
};
exports.DbUsersCrudToolService = DbUsersCrudToolService;
__decorate([
    (0, common_1.Inject)(users_service_1.UsersService),
    __metadata("design:type", users_service_1.UsersService)
], DbUsersCrudToolService.prototype, "usersService", void 0);
exports.DbUsersCrudToolService = DbUsersCrudToolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DbUsersCrudToolService);
//# sourceMappingURL=db-users-crud-tool.service.js.map