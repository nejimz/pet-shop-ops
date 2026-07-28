import { SalesService } from './sales.service';
import { CreateSaleDto } from './sales.dto';
import { JwtPayload } from '@petshop/shared';
export declare class SalesController {
    private sales;
    constructor(sales: SalesService);
    list(limit?: string): import("@prisma/client").Prisma.PrismaPromise<({
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
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
                price: import("@prisma/client/runtime/library").Decimal;
                stockQty: number;
                active: boolean;
            };
        } & {
            id: string;
            saleId: string;
            productId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
    }>;
    create(dto: CreateSaleDto, user: JwtPayload): Promise<{
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        createdAt: Date;
        ownerId: string | null;
        petId: string | null;
        occurredAt: Date;
        walkInName: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        total: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.SaleStatus;
        soldByUserId: string;
    }>;
}
