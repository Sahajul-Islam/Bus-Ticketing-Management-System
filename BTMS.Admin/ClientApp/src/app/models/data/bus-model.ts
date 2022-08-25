import { BusType } from "./enums";

export interface BusModel {
    busId: number | undefined;
    busPlateNumber: string;
    busModel:string;
    busType: BusType | undefined;
    capacity: number | undefined;
    features: string;
    
    companyId: number | undefined;
}
