import { AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteAppointmentDto, CreateAppointmentDto, UpdateAppointmentDto } from './appointments.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(from?: string, to?: string, status?: AppointmentStatus): Prisma.PrismaPromise<({
        owner: {
            id: string;
            name: string;
            phone: string | null;
        };
        pet: {
            id: string;
            name: string;
            species: string | null;
        };
        visit: {
            id: string;
            createdAt: Date;
            notes: string;
            ownerId: string;
            appointmentId: string;
            petId: string;
            treatmentsSummary: string | null;
            followUpAt: Date | null;
            occurredAt: Date;
        } | null;
        assignedUser: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        petId: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        startsAt: Date;
        type: import("@prisma/client").$Enums.AppointmentType;
        reason: string | null;
        assignedUserId: string | null;
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
        pet: {
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
        };
        visit: {
            id: string;
            createdAt: Date;
            notes: string;
            ownerId: string;
            appointmentId: string;
            petId: string;
            treatmentsSummary: string | null;
            followUpAt: Date | null;
            occurredAt: Date;
        } | null;
        assignedUser: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        petId: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        startsAt: Date;
        type: import("@prisma/client").$Enums.AppointmentType;
        reason: string | null;
        assignedUserId: string | null;
    }>;
    create(dto: CreateAppointmentDto): Promise<{
        owner: {
            id: string;
            name: string;
        };
        pet: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        petId: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        startsAt: Date;
        type: import("@prisma/client").$Enums.AppointmentType;
        reason: string | null;
        assignedUserId: string | null;
    }>;
    update(id: string, dto: UpdateAppointmentDto): Promise<{
        owner: {
            id: string;
            name: string;
        };
        pet: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        petId: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        startsAt: Date;
        type: import("@prisma/client").$Enums.AppointmentType;
        reason: string | null;
        assignedUserId: string | null;
    }>;
    complete(id: string, dto: CompleteAppointmentDto): Promise<{
        appointment: {
            owner: {
                id: string;
                name: string;
            };
            pet: {
                id: string;
                name: string;
            };
            visit: {
                id: string;
                createdAt: Date;
                notes: string;
                ownerId: string;
                appointmentId: string;
                petId: string;
                treatmentsSummary: string | null;
                followUpAt: Date | null;
                occurredAt: Date;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            petId: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            startsAt: Date;
            type: import("@prisma/client").$Enums.AppointmentType;
            reason: string | null;
            assignedUserId: string | null;
        };
        visit: {
            id: string;
            createdAt: Date;
            notes: string;
            ownerId: string;
            appointmentId: string;
            petId: string;
            treatmentsSummary: string | null;
            followUpAt: Date | null;
            occurredAt: Date;
        };
    }>;
}
