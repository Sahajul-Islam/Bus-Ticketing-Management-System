import { BookingStatus } from "../data/enums";

export interface SeatViewModel {
   seatSerial?:number|undefined
   seatNumber?:string|undefined;
   status?:BookingStatus|undefined;
   bus?:string|undefined;
   busRoute?:string|undefined;
   fare?:number|undefined;
   scheduleTime?:Date|undefined;
}
