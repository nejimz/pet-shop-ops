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
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PetsService = class PetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(search, includeArchived = false) {
        const where = {
            ...(includeArchived ? {} : { archivedAt: null }),
            ...(search
                ? {
                    OR: [
                        { name: { contains: search } },
                        { owner: { name: { contains: search } } },
                        { microchipId: { contains: search } },
                    ],
                }
                : {}),
        };
        return this.prisma.pet.findMany({
            where,
            include: { owner: { select: { id: true, name: true, phone: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async get(id) {
        const pet = await this.prisma.pet.findUnique({
            where: { id },
            include: { owner: true },
        });
        if (!pet)
            throw new common_1.NotFoundException('Pet not found');
        return pet;
    }
    async create(dto) {
        const owner = await this.prisma.owner.findUnique({ where: { id: dto.ownerId } });
        if (!owner)
            throw new common_1.BadRequestException('Owner not found');
        return this.prisma.pet.create({
            data: {
                ownerId: dto.ownerId,
                name: dto.name,
                species: dto.species,
                breed: dto.breed,
                sex: dto.sex,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                weight: dto.weight,
                allergies: dto.allergies,
                microchipId: dto.microchipId,
                notes: dto.notes,
            },
            include: { owner: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        await this.get(id);
        return this.prisma.pet.update({
            where: { id },
            data: {
                name: dto.name,
                species: dto.species,
                breed: dto.breed,
                sex: dto.sex,
                dateOfBirth: dto.dateOfBirth === undefined ? undefined : dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                weight: dto.weight,
                allergies: dto.allergies,
                microchipId: dto.microchipId,
                notes: dto.notes,
            },
            include: { owner: { select: { id: true, name: true } } },
        });
    }
    async archive(id) {
        await this.get(id);
        return this.prisma.pet.update({
            where: { id },
            data: { archivedAt: new Date() },
        });
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PetsService);
//# sourceMappingURL=pets.service.js.map