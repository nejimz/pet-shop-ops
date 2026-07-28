import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto } from './pets.dto';
import { TimelineService } from '../timeline/timeline.service';
export declare class PetsController {
    private pets;
    private timelineService;
    constructor(pets: PetsService, timelineService: TimelineService);
    list(q?: string, includeArchived?: string): import("@prisma/client").Prisma.PrismaPromise<({
        owner: {
            id: string;
            name: string;
            phone: string | null;
        };
    } & {
        id: string;
        name: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
    getTimeline(id: string): Promise<import("@petshop/shared").TimelineItem[]>;
    create(dto: CreatePetDto): Promise<{
        owner: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
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
