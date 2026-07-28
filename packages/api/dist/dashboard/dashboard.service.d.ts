import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        todayAppointments: number;
        ownerCount: number;
        petCount: number;
        recentSales: {
            id: string;
            total: number;
            status: import("@prisma/client").$Enums.SaleStatus;
            occurredAt: Date;
            buyer: string;
            items: string[];
        }[];
    }>;
}
