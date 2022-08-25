export interface ScheduleViewModel {
    scheduleId?:number | undefined;
    journeyDate?:Date | string;
    departureTime?:Date |string;
    minTimeToReportBeforeDeparture?:number |undefined;
    fareAmount?:number|undefined;
    busRoute?:string;
    bus?:string;
    busId?:number|undefined;
    busRouteId?:number|undefined;
}
