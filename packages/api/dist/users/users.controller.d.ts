import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }[]>;
    create(dto: CreateUserDto): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
