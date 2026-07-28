import { TimelineItem } from '@petshop/shared';
import { PrismaService } from '../prisma/prisma.service';
export declare class TimelineService {
    private prisma;
    constructor(prisma: PrismaService);
    forOwner(ownerId: string): Promise<TimelineItem[]>;
    forPet(petId: string): Promise<TimelineItem[]>;
}
