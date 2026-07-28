import { OwnersService } from './owners.service';
import { CreateOwnerDto, UpdateOwnerDto } from './owners.dto';
import { TimelineService } from '../timeline/timeline.service';
export declare class OwnersController {
    private owners;
    private timelineService;
    constructor(owners: OwnersService, timelineService: TimelineService);
    list(q?: string): import("@prisma/client").Prisma.PrismaPromise<({
        pets: {
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
        }[];
        _count: {
            pets: number;
            visits: number;
            sales: number;
        };
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    get(id: string): Promise<{
        pets: {
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
        }[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTimeline(id: string): Promise<import("@petshop/shared").TimelineItem[]>;
    create(dto: CreateOwnerDto): import("@prisma/client").Prisma.Prisma__OwnerClient<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateOwnerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
