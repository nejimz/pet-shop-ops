import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtPayload } from '@petshop/shared';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    me(user: JwtPayload): Promise<{
        email: string;
        id: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
