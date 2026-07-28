import { z } from 'zod';
export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly STAFF: "STAFF";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const AppointmentType: {
    readonly CHECKUP: "CHECKUP";
    readonly VACCINE: "VACCINE";
    readonly GROOMING: "GROOMING";
    readonly OTHER: "OTHER";
};
export type AppointmentType = (typeof AppointmentType)[keyof typeof AppointmentType];
export declare const AppointmentStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly NO_SHOW: "NO_SHOW";
};
export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly OTHER: "OTHER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const SaleStatus: {
    readonly COMPLETED: "COMPLETED";
    readonly VOIDED: "VOIDED";
};
export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];
export declare const PetSex: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
    readonly UNKNOWN: "UNKNOWN";
};
export type PetSex = (typeof PetSex)[keyof typeof PetSex];
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}
export declare function hasMinimumRole(role: UserRole, minimum: UserRole): boolean;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ownerSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodLiteral<"">]>;
    address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    notes?: string | null | undefined;
}, {
    name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    notes?: string | null | undefined;
}>;
export declare const petSchema: z.ZodObject<{
    ownerId: z.ZodString;
    name: z.ZodString;
    species: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    breed: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sex: z.ZodNullable<z.ZodOptional<z.ZodEnum<["MALE", "FEMALE", "UNKNOWN"]>>>;
    dateOfBirth: z.ZodUnion<[z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodNullable<z.ZodOptional<z.ZodString>>]>;
    weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    allergies: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    microchipId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ownerId: string;
    notes?: string | null | undefined;
    species?: string | null | undefined;
    breed?: string | null | undefined;
    sex?: "MALE" | "FEMALE" | "UNKNOWN" | null | undefined;
    dateOfBirth?: string | null | undefined;
    weight?: number | null | undefined;
    allergies?: string | null | undefined;
    microchipId?: string | null | undefined;
}, {
    name: string;
    ownerId: string;
    notes?: string | null | undefined;
    species?: string | null | undefined;
    breed?: string | null | undefined;
    sex?: "MALE" | "FEMALE" | "UNKNOWN" | null | undefined;
    dateOfBirth?: string | null | undefined;
    weight?: number | null | undefined;
    allergies?: string | null | undefined;
    microchipId?: string | null | undefined;
}>;
export type TimelineItemType = 'visit' | 'sale';
export interface TimelineItem {
    type: TimelineItemType;
    occurredAt: string;
    refId: string;
    summary: string;
    meta?: Record<string, unknown>;
}
