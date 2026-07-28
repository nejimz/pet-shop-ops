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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const [todayAppointments, recentSales, ownerCount, petCount] = await Promise.all([
            this.prisma.appointment.count({
                where: {
                    startsAt: { gte: start, lte: end },
                    status: client_1.AppointmentStatus.SCHEDULED,
                },
            }),
            this.prisma.sale.findMany({
                take: 8,
                orderBy: { occurredAt: 'desc' },
                include: {
                    owner: { select: { name: true } },
                    lines: { include: { product: { select: { name: true } } } },
                },
            }),
            this.prisma.owner.count(),
            this.prisma.pet.count({ where: { archivedAt: null } }),
        ]);
        return {
            todayAppointments,
            ownerCount,
            petCount,
            recentSales: recentSales.map((s) => ({
                id: s.id,
                total: Number(s.total),
                status: s.status,
                occurredAt: s.occurredAt,
                buyer: s.owner?.name || s.walkInName || 'Walk-in',
                items: s.lines.map((l) => l.product.name),
            })),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map