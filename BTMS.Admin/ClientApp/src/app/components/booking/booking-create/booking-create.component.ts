import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { email } from '@rxweb/reactive-form-validators';
import { BookingStatus } from 'src/app/models/data/enums';
import { BookingInputModel } from 'src/app/models/viewmodels/input/booking-input-model';
import { SeatViewModel } from 'src/app/models/viewmodels/seat-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { SignalRService } from 'src/app/services/common/signal-r.service';
import { BookingService } from 'src/app/services/data/booking.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.css']
})
export class BookingCreateComponent implements OnInit {
  booking:BookingInputModel= { }
  seats: SeatViewModel[] =[];
  selectedSeats:SeatViewModel[] =[];
  scheduleId!:number;
  bookingSuccess:string ='';
  trackCode: string ='';

  //-----------------
  bookingForm:FormGroup = new FormGroup({
    customer: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  constructor(
    private bookingService:BookingService,
    private signalrService:SignalRService,
    private notifyService:NotifyService,
    private activatedRoute:ActivatedRoute
  ) { }

  isGap(i:number){
    return [3, 8, 13, 18].indexOf(i)>=0;
  }
  isDisabled(data:SeatViewModel){
    return data.status == BookingStatus.Booked;
  }
  isFree (data:SeatViewModel){
    //console.log('isFree ' +(data.status));
    return data.seatSerial !=0 && data.status == BookingStatus.Free;
  }
  isSelected(data:SeatViewModel){
    //console.log('isFree ' +(data.status));
    return data.seatSerial !=0 && data.status == BookingStatus.Selected;
  }
  isBooked (data:SeatViewModel){
    //console.log('isFree ' +(data.status));
    return data.seatSerial !=0 && data.status == BookingStatus.Booked;
  }
  selectSeat(data:SeatViewModel, event:any){
    event.preventDefault();
    let i = this.selectedSeats.findIndex(s=> s.seatSerial == data.seatSerial);
    if(i>=0)
      this.selectedSeats.splice(i, 1);
    else
      this.selectedSeats.push(data);
    data.status= data.status == BookingStatus.Selected ? BookingStatus.Free : BookingStatus.Selected;
  }
 getSelected(){
   if(this.selectedSeats.length == 0) return '';
   let s:string[] =[];
  this.selectedSeats.forEach(x=> {
    s.push(String(x.seatSerial));
  });
  return s.join(',');
 }
 getFare(){
   return this.getSelected()?.length*Number(this.seats[0]?.fare);
 }
 saveBooking(){
   
   if(this.bookingForm.invalid) return;
   if(this.selectedSeats.length < 1) {
     this.notifyService.success('No seat selected', 'DISMISS');
     return;
   }
   Object.assign(this.booking, this.bookingForm.value);
   this.booking.scheduleId= this.scheduleId;
   this.booking.seatNumbers=[];
   this.selectedSeats.forEach(s =>{
     this.booking.seatNumbers?.push(Number(s.seatNumber));
   });
   console.log(this.booking);
   this.bookingService.bookSeats(this.booking)
  .subscribe({
    next: r=> {
      console.log(r);
      this.bookingSuccess=r.message ?? '';
      this.trackCode = r.trackingCode ?? '';
      r.seats?.forEach(x=>{
        let seat =this.seats.find(s=> s.seatSerial == x);
        if(seat)
        seat.status = BookingStatus.Booked;
      })
      //this.notifyService.success("Bookig saved", "DISMISS")
    },
    error: err=>{
      this.notifyService.fail('Faled to create bookig', 'DISMISS')
      console.log(err.message|err);
    }
  })
 }
 Test(){
  let data:BookingInputModel = {
    customer:'A',
    phone:'1298',
    email: 'a@b.com',
    scheduleId:this.scheduleId,
    seatNumbers:[1, 3]
  };
  this.bookingService.bookSeats(data)
  .subscribe({
    next: r=> {
      console.log(r);
    },
    error: err=>{
      console.log(err.message|err);
    }
  })
  
 }
  ngOnInit(): void {
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.scheduleId=id;
    this.bookingService.getSeatsBySchedule(id)
    .subscribe({
      next:r=>{
        this.seats = r;
        console.log(this.seats)
        this.seats[0].status= BookingStatus.Booked;
      }
    });
    this.signalrService.bookingMessage
    .subscribe(m=>{
      
      if(m) {
        this.notifyService.success(m.message ?? '', "DISMISS")
        if(this.scheduleId == m.scheduleId){
          console.log(this.scheduleId)
          m.seats?.forEach(s=>{
            let seat =this.seats.find(x=> x.seatSerial == s);
            if(seat)
            seat.status = BookingStatus.Booked;
          })
        }
        
      }
    })
  }

}
