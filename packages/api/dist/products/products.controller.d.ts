import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
export declare class ProductsController {
    private products;
    constructor(products: ProductsService);
    list(q?: string, activeOnly?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
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
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
        active: boolean;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
        active: boolean;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal;
        stockQty: number;
        active: boolean;
    }>;
}
