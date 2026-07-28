import { PetSex } from '@petshop/shared';
export declare class CreatePetDto {
    ownerId: string;
    name: string;
    species?: string;
    breed?: string;
    sex?: PetSex;
    dateOfBirth?: string;
    weight?: number;
    allergies?: string;
    microchipId?: string;
    notes?: string;
}
export declare class UpdatePetDto {
    name?: string;
    species?: string;
    breed?: string;
    sex?: PetSex;
    dateOfBirth?: string;
    weight?: number;
    allergies?: string;
    microchipId?: string;
    notes?: string;
}
