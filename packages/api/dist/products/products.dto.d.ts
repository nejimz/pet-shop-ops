export declare class CreateProductDto {
    name: string;
    sku: string;
    price: number;
    stockQty?: number;
    active?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    sku?: string;
    price?: number;
    stockQty?: number;
    active?: boolean;
}
