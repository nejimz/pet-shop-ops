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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let SalesService = class SalesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(limit = 50) {
        return this.prisma.sale.findMany({
            take: Math.min(limit, 200),
            orderBy: { occurredAt: 'desc' },
            include: {
                owner: { select: { id: true, name: true } },
                pet: { select: { id: true, name: true } },
                soldBy: { select: { id: true, name: true } },
                lines: { include: { product: { select: { id: true, name: true, sku: true } } } },
            },
        });
    }
    async get(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                owner: true,
                pet: true,
                soldBy: { select: { id: true, name: true } },
                lines: { include: { product: true } },
            },
        });
        if (!sale)
            throw new common_1.NotFoundException('Sale not found');
        return sale;
    }
    async create(dto, soldByUserId) {
        if (!dto.ownerId && !dto.walkInName?.trim()) {
            throw new common_1.BadRequestException('Provide ownerId or walkInName for walk-in sales');
        }
        if (dto.ownerId) {
            const owner = await this.prisma.owner.findUnique({ where: { id: dto.ownerId } });
            if (!owner)
                throw new common_1.BadRequestException('Owner not found');
        }
        if (dto.petId) {
            const pet = await this.prisma.pet.findUnique({ where: { id: dto.petId } });
            if (!pet)
                throw new common_1.BadRequestException('Pet not found');
            if (dto.ownerId && pet.ownerId !== dto.ownerId) {
                throw new common_1.BadRequestException('Pet does not belong to owner');
            }
        }
        const productIds = dto.lines.map((l) => l.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, active: true },
        });
        if (products.length !== new Set(productIds).size) {
            throw new common_1.BadRequestException('One or more products are missing or inactive');
        }
        const byId = new Map(products.map((p) => [p.id, p]));
        const lineData = dto.lines.map((line) => {
            const product = byId.get(line.productId);
            if (product.stockQty < line.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}`);
            }
            const unitPrice = line.unitPrice ?? Number(product.price);
            return {
                productId: product.id,
                quantity: line.quantity,
                unitPrice,
                lineTotal: unitPrice * line.quantity,
            };
        });
        const total = lineData.reduce((sum, l) => sum + l.lineTotal, 0);
        return this.prisma.$transaction(async (tx) => {
            for (const line of lineData) {
                const updated = await tx.product.updateMany({
                    where: { id: line.productId, stockQty: { gte: line.quantity } },
                    data: { stockQty: { decrement: line.quantity } },
                });
                if (updated.count !== 1) {
                    throw new common_1.BadRequestException('Insufficient stock (concurrent update)');
                }
            }
            return tx.sale.create({
                data: {
                    ownerId: dto.ownerId,
                    walkInName: dto.walkInName?.trim() || null,
                    petId: dto.petId,
                    paymentMethod: dto.paymentMethod,
                    total,
                    soldByUserId,
                    status: client_1.SaleStatus.COMPLETED,
                    lines: {
                        create: lineData.map((l) => ({
                            productId: l.productId,
                            quantity: l.quantity,
                            unitPrice: l.unitPrice,
                        })),
                    },
                },
                include: {
                    owner: { select: { id: true, name: true } },
                    pet: { select: { id: true, name: true } },
                    lines: { include: { product: { select: { id: true, name: true, sku: true } } } },
                },
            });
        });
    }
    async void(id) {
        const sale = await this.get(id);
        if (sale.status === client_1.SaleStatus.VOIDED) {
            throw new common_1.BadRequestException('Sale already voided');
        }
        return this.prisma.$transaction(async (tx) => {
            for (const line of sale.lines) {
                await tx.product.update({
                    where: { id: line.productId },
                    data: { stockQty: { increment: line.quantity } },
                });
            }
            return tx.sale.update({
                where: { id },
                data: { status: client_1.SaleStatus.VOIDED },
                include: {
                    owner: { select: { id: true, name: true } },
                    lines: { include: { product: { select: { id: true, name: true, sku: true } } } },
                },
            });
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map