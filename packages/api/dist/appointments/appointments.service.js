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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(from, to, status) {
        const where = {};
        if (status)
            where.status = status;
        if (from || to) {
            where.startsAt = {};
            if (from)
                where.startsAt.gte = new Date(from);
            if (to)
                where.startsAt.lte = new Date(to);
        }
        return this.prisma.appointment.findMany({
            where,
            include: {
                owner: { select: { id: true, name: true, phone: true } },
                pet: { select: { id: true, name: true, species: true } },
                assignedUser: { select: { id: true, name: true } },
                visit: true,
            },
            orderBy: { startsAt: 'asc' },
        });
    }
    async get(id) {
        const appt = await this.prisma.appointment.findUnique({
            where: { id },
            include: {
                owner: true,
                pet: true,
                assignedUser: { select: { id: true, name: true } },
                visit: true,
            },
        });
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found');
        return appt;
    }
    async create(dto) {
        const pet = await this.prisma.pet.findUnique({ where: { id: dto.petId } });
        if (!pet || pet.ownerId !== dto.ownerId) {
            throw new common_1.BadRequestException('Pet not found for this owner');
        }
        if (pet.archivedAt)
            throw new common_1.BadRequestException('Cannot book for archived pet');
        return this.prisma.appointment.create({
            data: {
                ownerId: dto.ownerId,
                petId: dto.petId,
                startsAt: new Date(dto.startsAt),
                type: dto.type,
                reason: dto.reason,
                assignedUserId: dto.assignedUserId,
            },
            include: {
                owner: { select: { id: true, name: true } },
                pet: { select: { id: true, name: true } },
            },
        });
    }
    async update(id, dto) {
        const appt = await this.get(id);
        if (appt.status === client_1.AppointmentStatus.COMPLETED && dto.status && dto.status !== client_1.AppointmentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot change status of a completed appointment');
        }
        if (dto.status === client_1.AppointmentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Use POST /appointments/:id/complete to complete');
        }
        return this.prisma.appointment.update({
            where: { id },
            data: {
                startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
                type: dto.type,
                reason: dto.reason,
                assignedUserId: dto.assignedUserId,
                status: dto.status,
            },
            include: {
                owner: { select: { id: true, name: true } },
                pet: { select: { id: true, name: true } },
            },
        });
    }
    async complete(id, dto) {
        const appt = await this.get(id);
        if (appt.status !== client_1.AppointmentStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Only scheduled appointments can be completed');
        }
        if (!dto.notes?.trim()) {
            throw new common_1.BadRequestException('Visit notes are required');
        }
        return this.prisma.$transaction(async (tx) => {
            const visit = await tx.visit.create({
                data: {
                    appointmentId: appt.id,
                    ownerId: appt.ownerId,
                    petId: appt.petId,
                    notes: dto.notes.trim(),
                    treatmentsSummary: dto.treatmentsSummary,
                    followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : undefined,
                    occurredAt: new Date(),
                },
            });
            const appointment = await tx.appointment.update({
                where: { id },
                data: { status: client_1.AppointmentStatus.COMPLETED },
                include: {
                    owner: { select: { id: true, name: true } },
                    pet: { select: { id: true, name: true } },
                    visit: true,
                },
            });
            return { appointment, visit };
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map