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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");

const saleInclude = {
    owner: { select: { id: true, name: true } },
    pet: { select: { id: true, name: true } },
    soldBy: { select: { id: true, name: true } },
    lines: { include: { product: { select: { id: true, name: true, sku: true } } } },
};

function dayKey(date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    buildWhere(query, { ignoreStatus = false } = {}) {
        const where = {};
        const occurredAt = {};
        if (query.from) {
            const from = new Date(query.from);
            if (!Number.isNaN(from.getTime())) occurredAt.gte = from;
        }
        if (query.to) {
            const to = new Date(query.to);
            if (!Number.isNaN(to.getTime())) occurredAt.lte = to;
        }
        if (Object.keys(occurredAt).length) where.occurredAt = occurredAt;

        if (!ignoreStatus && (query.status === "COMPLETED" || query.status === "VOIDED")) {
            where.status = query.status;
        }
        if (
            query.paymentMethod === "CASH" ||
            query.paymentMethod === "CARD" ||
            query.paymentMethod === "OTHER"
        ) {
            where.paymentMethod = query.paymentMethod;
        }

        const q = (query.q || "").trim();
        if (q) {
            where.OR = [
                { walkInName: { contains: q } },
                { owner: { name: { contains: q } } },
                { lines: { some: { product: { name: { contains: q } } } } },
            ];
        }
        return where;
    }

    buildCharts(completedRows, completedCount, voidedCount) {
        const byDay = new Map();
        const byPayment = new Map();

        for (const row of completedRows) {
            const date = dayKey(row.occurredAt);
            const day = byDay.get(date) || { date, revenue: 0, count: 0 };
            day.revenue += Number(row.total);
            day.count += 1;
            byDay.set(date, day);

            const method = row.paymentMethod;
            const pay = byPayment.get(method) || { paymentMethod: method, revenue: 0, count: 0 };
            pay.revenue += Number(row.total);
            pay.count += 1;
            byPayment.set(method, pay);
        }

        const revenueByDay = [...byDay.values()]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((d) => ({
                date: d.date,
                revenue: Math.round(d.revenue * 100) / 100,
                count: d.count,
            }));

        const byPaymentMethod = ["CASH", "CARD", "OTHER"]
            .map((paymentMethod) => byPayment.get(paymentMethod))
            .filter(Boolean)
            .map((p) => ({
                paymentMethod: p.paymentMethod,
                revenue: Math.round(p.revenue * 100) / 100,
                count: p.count,
            }));

        const byStatus = [
            { status: "COMPLETED", count: completedCount },
            { status: "VOIDED", count: voidedCount },
        ].filter((s) => s.count > 0);

        return { revenueByDay, byPaymentMethod, byStatus };
    }

    async transactions(query = {}) {
        const page = Math.max(1, Number(query.page) || 1);
        const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 50));
        const where = this.buildWhere(query);
        const whereNoStatus = this.buildWhere(query, { ignoreStatus: true });

        const [
            items,
            total,
            completedCount,
            voidedCount,
            revenueAgg,
            completedForCharts,
        ] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { occurredAt: "desc" },
                include: saleInclude,
            }),
            this.prisma.sale.count({ where }),
            this.prisma.sale.count({
                where: { ...whereNoStatus, status: client_1.SaleStatus.COMPLETED },
            }),
            this.prisma.sale.count({
                where: { ...whereNoStatus, status: client_1.SaleStatus.VOIDED },
            }),
            this.prisma.sale.aggregate({
                where: { ...where, status: client_1.SaleStatus.COMPLETED },
                _sum: { total: true },
            }),
            this.prisma.sale.findMany({
                where: { ...whereNoStatus, status: client_1.SaleStatus.COMPLETED },
                select: {
                    occurredAt: true,
                    total: true,
                    paymentMethod: true,
                    status: true,
                },
                orderBy: { occurredAt: "asc" },
            }),
        ]);

        return {
            items,
            total,
            page,
            pageSize,
            summary: {
                count: total,
                completedCount,
                voidedCount,
                revenue: Number(revenueAgg._sum.total ?? 0),
            },
            charts: this.buildCharts(completedForCharts, completedCount, voidedCount),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
