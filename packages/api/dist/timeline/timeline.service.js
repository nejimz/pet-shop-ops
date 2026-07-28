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
exports.TimelineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TimelineService = class TimelineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async forOwner(ownerId) {
        const owner = await this.prisma.owner.findUnique({ where: { id: ownerId } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        const [visits, sales] = await Promise.all([
            this.prisma.visit.findMany({
                where: { ownerId },
                include: { pet: { select: { name: true } } },
                orderBy: { occurredAt: 'desc' },
            }),
            this.prisma.sale.findMany({
                where: { ownerId },
                include: { lines: { include: { product: { select: { name: true } } } } },
                orderBy: { occurredAt: 'desc' },
            }),
        ]);
        const items = [
            ...visits.map((v) => ({
                type: 'visit',
                occurredAt: v.occurredAt.toISOString(),
                refId: v.id,
                summary: `Visit for ${v.pet.name}: ${v.notes.slice(0, 120)}`,
                meta: { petId: v.petId, treatmentsSummary: v.treatmentsSummary },
            })),
            ...sales.map((s) => ({
                type: 'sale',
                occurredAt: s.occurredAt.toISOString(),
                refId: s.id,
                summary: `Sale $${Number(s.total).toFixed(2)} (${s.status}) — ${s.lines.map((l) => l.product.name).join(', ')}`,
                meta: { status: s.status, total: Number(s.total) },
            })),
        ];
        return items.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    }
    async forPet(petId) {
        const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
        if (!pet)
            throw new common_1.NotFoundException('Pet not found');
        const [visits, sales] = await Promise.all([
            this.prisma.visit.findMany({
                where: { petId },
                orderBy: { occurredAt: 'desc' },
            }),
            this.prisma.sale.findMany({
                where: { petId },
                include: { lines: { include: { product: { select: { name: true } } } } },
                orderBy: { occurredAt: 'desc' },
            }),
        ]);
        const items = [
            ...visits.map((v) => ({
                type: 'visit',
                occurredAt: v.occurredAt.toISOString(),
                refId: v.id,
                summary: `Visit: ${v.notes.slice(0, 120)}`,
                meta: { treatmentsSummary: v.treatmentsSummary, followUpAt: v.followUpAt },
            })),
            ...sales.map((s) => ({
                type: 'sale',
                occurredAt: s.occurredAt.toISOString(),
                refId: s.id,
                summary: `Sale $${Number(s.total).toFixed(2)} (${s.status}) — ${s.lines.map((l) => l.product.name).join(', ')}`,
                meta: { status: s.status, total: Number(s.total) },
            })),
        ];
        return items.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    }
};
exports.TimelineService = TimelineService;
exports.TimelineService = TimelineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimelineService);
//# sourceMappingURL=timeline.service.js.map