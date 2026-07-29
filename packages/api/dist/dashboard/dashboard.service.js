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
const LOW_STOCK_THRESHOLD = 5;
const appointmentInclude = {
    owner: { select: { id: true, name: true } },
    pet: { select: { id: true, name: true } },
};
function mapAppointment(a) {
    return {
        id: a.id,
        startsAt: a.startsAt,
        type: a.type,
        owner: a.owner,
        pet: a.pet,
    };
}
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary() {
        const now = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const [
            todayAppointments,
            recentSales,
            ownerCount,
            petCount,
            todaySalesAgg,
            todaySalesCount,
            upcomingAppointments,
            overdueAppointments,
            followUpsDue,
            lowStockProducts,
        ] = await Promise.all([
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
            this.prisma.sale.aggregate({
                where: {
                    occurredAt: { gte: start, lte: end },
                    status: client_1.SaleStatus.COMPLETED,
                },
                _sum: { total: true },
            }),
            this.prisma.sale.count({
                where: {
                    occurredAt: { gte: start, lte: end },
                    status: client_1.SaleStatus.COMPLETED,
                },
            }),
            this.prisma.appointment.findMany({
                where: {
                    status: client_1.AppointmentStatus.SCHEDULED,
                    startsAt: { gte: now, lte: end },
                },
                orderBy: { startsAt: 'asc' },
                take: 5,
                include: appointmentInclude,
            }),
            this.prisma.appointment.findMany({
                where: {
                    status: client_1.AppointmentStatus.SCHEDULED,
                    startsAt: { lt: now },
                },
                orderBy: { startsAt: 'asc' },
                take: 5,
                include: appointmentInclude,
            }),
            this.prisma.visit.findMany({
                where: {
                    followUpAt: { not: null, lte: end },
                },
                orderBy: { followUpAt: 'asc' },
                take: 5,
                include: {
                    owner: { select: { id: true, name: true } },
                    pet: { select: { id: true, name: true } },
                },
            }),
            this.prisma.product.findMany({
                where: {
                    active: true,
                    stockQty: { lte: LOW_STOCK_THRESHOLD },
                },
                orderBy: { stockQty: 'asc' },
                take: 5,
                select: { id: true, name: true, sku: true, stockQty: true },
            }),
        ]);
        return {
            todayAppointments,
            ownerCount,
            petCount,
            todayRevenue: Number(todaySalesAgg._sum.total ?? 0),
            todaySalesCount,
            upcomingAppointments: upcomingAppointments.map(mapAppointment),
            overdueAppointments: overdueAppointments.map(mapAppointment),
            followUpsDue: followUpsDue.map((v) => ({
                id: v.id,
                followUpAt: v.followUpAt,
                owner: v.owner,
                pet: v.pet,
            })),
            lowStockProducts,
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
