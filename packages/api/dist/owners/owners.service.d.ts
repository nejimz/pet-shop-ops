import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto, UpdateOwnerDto } from './owners.dto';
export declare class OwnersService {
    private prisma;
    constructor(prisma: PrismaService);
    list(search?: string): Prisma.PrismaPromise<({
        _count: {
            sales: number;
            pets: number;
            visits: number;
        };
        pets: {
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
        }[];
    } & {
        email: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        notes: string | null;
    })[]>;
    get(id: string): Promise<{
        pets: {
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
        }[];
    } & {
        email: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        notes: string | null;
    }>;
    create(dto: CreateOwnerDto): Prisma.Prisma__OwnerClient<{
        email: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateOwnerDto): Promise<{
        email: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        address: string | null;
        notes: string | null;
    }>;
}
