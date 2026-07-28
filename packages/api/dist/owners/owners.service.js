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
exports.OwnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OwnersService = class OwnersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(search) {
        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { phone: { contains: search } },
                    { email: { contains: search } },
                    { pets: { some: { name: { contains: search } } } },
                ],
            }
            : {};
        return this.prisma.owner.findMany({
            where,
            include: {
                pets: { where: { archivedAt: null }, orderBy: { name: 'asc' } },
                _count: { select: { pets: true, visits: true, sales: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async get(id) {
        const owner = await this.prisma.owner.findUnique({
            where: { id },
            include: {
                pets: { orderBy: [{ archivedAt: 'asc' }, { name: 'asc' }] },
            },
        });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        return owner;
    }
    create(dto) {
        return this.prisma.owner.create({ data: dto });
    }
    async update(id, dto) {
        await this.get(id);
        return this.prisma.owner.update({ where: { id }, data: dto });
    }
};
exports.OwnersService = OwnersService;
exports.OwnersService = OwnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnersService);
//# sourceMappingURL=owners.service.js.map