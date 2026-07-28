import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    list(search?: string, activeOnly?: boolean): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: Prisma.Decimal;
        stockQty: number;
        active: boolean;
    }[]>;
    get(id: string): Promise<{
        saleLines: ({
            sale: {
                owner: {
                    id: string;
                    name: string;
                } | null;
                id: string;
                occurredAt: Date;
                walkInName: string | null;
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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: Prisma.Decimal;
        stockQty: number;
        active: boolean;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: Prisma.Decimal;
        stockQty: number;
        active: boolean;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: Prisma.Decimal;
        stockQty: number;
        active: boolean;
    }>;
}
