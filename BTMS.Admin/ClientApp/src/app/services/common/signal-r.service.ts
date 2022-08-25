import { EventEmitter, Injectable, Output } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { BookingMessage } from 'src/app/models/common/booking-message';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  connection!:signalR.HubConnection;
  bookingMessage!: BehaviorSubject<BookingMessage|undefined>;
  @Output() orderEvent: EventEmitter<string|undefined> = new EventEmitter<string|undefined>();
  constructor() { 
    this.bookingMessage= new BehaviorSubject<BookingMessage|undefined>(undefined);
  }
  intializeConnection():Promise<any>{
    
    return new Promise((resolve, reject) => {
      this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConstants.rootUrl}/bookinghub`)
      .build();
      this.connection.on("seatBooked", data => {
        console.log("data");
        this.bookingMessage.next(data);
        this.orderEvent.emit("Seat booked")
      });
      this.connection
        .start()
        .then(() => {
          console.log(`SignalR connection success! connectionId: ${this.connection.connectionId} `);
          resolve({});
        })
        .catch((error) => {
          console.log(`SignalR connection error: ${error}`);
          reject();
        });
    });
  }
}
