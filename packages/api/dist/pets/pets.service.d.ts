import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto, UpdatePetDto } from './pets.dto';
export declare class PetsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(search?: string, includeArchived?: boolean): Prisma.PrismaPromise<({
        owner: {
            id: string;
            name: string;
            phone: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        archivedAt: Date | null;
        ownerId: string;
        species: string | null;
        breed: string | null;
        sex: import("@prisma/client").$Enums.PetSex | null;
        dateOfBirth: Date | null;
        weight: number | null;
        allergies: string | null;
        microchipId: string | null;
    })[]>;
    get(id: string): Promise<{
        owner: {
            email: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            address: string | null;
            notes: string | null;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        archivedAt: Date | null;
        ownerId: string;
        species: string | null;
        breed: string | null;
        sex: import("@prisma/client").$Enums.PetSex | null;
        dateOfBirth: Date | null;
        weight: number | null;
        allergies: string | null;
        microchipId: string | null;
    }>;
    create(dto: CreatePetDto): Promise<{
        owner: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        archivedAt: Date | null;
        ownerId: string;
        species: string | null;
        breed: string | null;
        sex: import("@prisma/client").$Enums.PetSex | null;
        dateOfBirth: Date | null;
        weight: number | null;
        allergies: string | null;
        microchipId: string | null;
    }>;
    update(id: string, dto: UpdatePetDto): Promise<{
        owner: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        archivedAt: Date | null;
        ownerId: string;
        species: string | null;
        breed: string | null;
        sex: import("@prisma/client").$Enums.PetSex | null;
        dateOfBirth: Date | null;
        weight: number | null;
        allergies: string | null;
        microchipId: string | null;
    }>;
    archive(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        archivedAt: Date | null;
        ownerId: string;
        species: string | null;
        breed: string | null;
        sex: import("@prisma/client").$Enums.PetSex | null;
        dateOfBirth: Date | null;
        weight: number | null;
        allergies: string | null;
        microchipId: string | null;
    }>;
}
