import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboard;
    constructor(dashboard: DashboardService);
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
