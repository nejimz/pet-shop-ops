import { UserRole } from '@petshop/shared';
export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    role?: UserRole;
    password?: string;
}
