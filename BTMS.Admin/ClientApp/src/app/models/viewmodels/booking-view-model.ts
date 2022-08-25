export interface BookingViewModel {
    bookingId?:number|undefined;

    customer?:string|undefined;
    phone?:string|undefined;

    email?:string|undefined;
    
    bookingCode?:string|undefined;
    seatNumber?:number|undefined
    
    
   
    bookingDate?:Date|string|undefined;
    bookingStatus?:boolean|undefined
    
    transactionId:string|undefined;
    isPaid?:boolean|undefined;
    isConfirmed?:boolean|undefined;

    scheduleId?:number|undefined;
    bus?:string|undefined;
    company?:string|undefined
}
