import { BoardingPoint } from "./boarding-point";

export interface BusRoute {
    busRouteId:number|undefined;
    from:string;
    to:string;
    companyId:number|undefined;
    boardingPoints:BoardingPoint[];
}
