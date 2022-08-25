export interface BookingInputModel {
    customer?:string|undefined;

    phone?:string|undefined;
    
    email?:string|undefined;
    scheduleId?:number|undefined
    seatNumbers?:number[]
}
