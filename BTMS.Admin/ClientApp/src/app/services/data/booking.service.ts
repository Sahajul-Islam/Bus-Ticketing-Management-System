import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingModel } from 'src/app/models/data/booking-model';
import { BookingMessageViewModel } from 'src/app/models/viewmodels/booking-message-view-model';
import { BookingSummaryViewModel } from 'src/app/models/viewmodels/booking-summary-view-model';
import { BookingViewModel } from 'src/app/models/viewmodels/booking-view-model';
import { BookingInputModel } from 'src/app/models/viewmodels/input/booking-input-model';
import { TransactionIdInputModel } from 'src/app/models/viewmodels/input/transaction-id-input-model';
import { SeatViewModel } from 'src/app/models/viewmodels/seat-view-model';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private http:HttpClient
  ) { }
  getSeatsBySchedule(id:number):Observable<SeatViewModel[]>{
    return this.http.get<SeatViewModel[]>(`${AppConstants.apiUrl}/Bookings/Seats/${id}`);
  }
  bookSeats(data:BookingInputModel):Observable<BookingMessageViewModel>{
    return this.http.post<BookingMessageViewModel>(`${AppConstants.apiUrl}/Bookings/Book`, data);
  }
 getSummaryOfDate(date:string):Observable<BookingSummaryViewModel[]>{
    return this.http.get<BookingSummaryViewModel[]>(`${AppConstants.apiUrl}/Bookings/Date/${date}`);
 }
 getPendingBookings():Observable<BookingModel[]> {
   return this.http.get<BookingModel[]>(`${AppConstants.apiUrl}/Bookings/Pending`)

 }
 getPendingBookingVMs(id:number):Observable<BookingViewModel[]> {
  return this.http.get<BookingViewModel[]>(`${AppConstants.apiUrl}/Bookings/VM/Pending/${id}`);

}
updateTrxId(data:BookingModel):Observable<any>{
  return this.http.put<any>(`${AppConstants.apiUrl}/Bookings/${data.bookingId}`, data);
}
}
