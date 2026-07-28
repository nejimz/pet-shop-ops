import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './sales.dto';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    list(limit?: number): Prisma.PrismaPromise<({
        owner: {
            id: string;
            name: string;
        } | null;
        pet: {
            id: string;
            name: string;
        } | null;
        soldBy: {
            id: string;
            name: string;
        };
        lines: ({
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
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
        } | null;
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
        } | null;
        soldBy: {
            id: string;
            name: string;
        };
        lines: ({
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                price: Prisma.Decimal;
                stockQty: number;
                active: boolean;
            };
        } & {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
    }>;
    create(dto: CreateSaleDto, soldByUserId: string): Promise<{
        owner: {
            id: string;
            name: string;
        } | null;
        pet: {
            id: string;
            name: string;
        } | null;
        lines: ({
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
    }>;
    void(id: string): Promise<{
        owner: {
            id: string;
            name: string;
        } | null;
        lines: ({
            product: {
                id: string;
                name: string;
                sku: string;
            };
        } & {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            unitPrice: Prisma.Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: Prisma.Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
    }>;
}
