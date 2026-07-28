import { AppointmentStatus, AppointmentType } from '@petshop/shared';
export declare class CreateAppointmentDto {
    ownerId: string;
    petId: string;
    startsAt: string;
    type?: AppointmentType;
    reason?: string;
    assignedUserId?: string;
}
export declare class UpdateAppointmentDto {
    startsAt?: string;
    type?: AppointmentType;
    reason?: string;
    assignedUserId?: string;
    status?: AppointmentStatus;
}
export declare class CompleteAppointmentDto {
    notes: string;
    treatmentsSummary?: string;
    followUpAt?: string;
}
