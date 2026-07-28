"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petSchema = exports.ownerSchema = exports.loginSchema = exports.PetSex = exports.SaleStatus = exports.PaymentMethod = exports.AppointmentStatus = exports.AppointmentType = exports.UserRole = void 0;
exports.hasMinimumRole = hasMinimumRole;
const zod_1 = require("zod");
exports.UserRole = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
};
exports.AppointmentType = {
    CHECKUP: 'CHECKUP',
    VACCINE: 'VACCINE',
    GROOMING: 'GROOMING',
    OTHER: 'OTHER',
};
exports.AppointmentStatus = {
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
};
exports.PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    OTHER: 'OTHER',
};
exports.SaleStatus = {
    COMPLETED: 'COMPLETED',
    VOIDED: 'VOIDED',
};
exports.PetSex = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    UNKNOWN: 'UNKNOWN',
};
function hasMinimumRole(role, minimum) {
    if (minimum === exports.UserRole.STAFF)
        return true;
    return role === exports.UserRole.ADMIN;
}
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.ownerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    phone: zod_1.z.string().max(50).optional().nullable(),
    email: zod_1.z.string().email().optional().nullable().or(zod_1.z.literal('')),
    address: zod_1.z.string().max(500).optional().nullable(),
    notes: zod_1.z.string().max(5000).optional().nullable(),
});
exports.petSchema = zod_1.z.object({
    ownerId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1).max(200),
    species: zod_1.z.string().max(100).optional().nullable(),
    breed: zod_1.z.string().max(100).optional().nullable(),
    sex: zod_1.z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional().nullable(),
    dateOfBirth: zod_1.z.string().datetime().optional().nullable().or(zod_1.z.string().optional().nullable()),
    weight: zod_1.z.number().positive().optional().nullable(),
    allergies: zod_1.z.string().max(2000).optional().nullable(),
    microchipId: zod_1.z.string().max(100).optional().nullable(),
    notes: zod_1.z.string().max(5000).optional().nullable(),
});
