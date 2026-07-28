import { PaymentMethod } from '@petshop/shared';
export declare class SaleLineDto {
    productId: string;
    quantity: number;
    unitPrice?: number;
}
export declare class CreateSaleDto {
    ownerId?: string;
    walkInName?: string;
    petId?: string;
    paymentMethod: PaymentMethod;
    lines: SaleLineDto[];
}
