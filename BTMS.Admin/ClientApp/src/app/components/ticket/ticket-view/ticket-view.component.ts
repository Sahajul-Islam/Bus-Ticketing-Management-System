import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingModel } from 'src/app/models/data/booking-model';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BookingService } from 'src/app/services/data/booking.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent implements OnInit {
 bookings:BookingModel[]=[];
 //-----------
 dataSource:MatTableDataSource<BookingModel> = new MatTableDataSource(this.bookings);
  columnList:string[] =["bus", "bookingDate", "customer", "phone", "bookingCode" ,"transactionId", "isPaid"];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  //tracking
  bookingEditList:{id:number, editing:boolean}[]=[];
  constructor(
    private bookingService: BookingService,
    private userService:UserService,
    private notifyService:NotifyService
  ) { }
  getTrackingEdit(id: number): boolean {
    let o = this.bookingEditList.find(x => <number>x.id == id);
    return o?.editing ?? false;
  }
  setTrackingInEditMode(data:BookingModel){
    this.bookingEditList.push({id:<number>data.bookingId, editing:true})
  }
  clearTrackingInEditMode(id:number){
    let i = this.bookingEditList.findIndex(x => <number>x.id == id);
    if(i>=0) this.bookingEditList.splice(i, 1);
  }
  updateTransactionId(data:BookingModel){
    data.isConfirmed=true;
    data.isPaid=true;
    data.bookingStatus=true;
    this.bookingService.updateTrxId(data)
    .subscribe({
      next:r=>{
        this.notifyService.success("Data updated", "DISMISS");
      }
    })
  }
  ngOnInit(): void {
    this.bookingService.getPendingBookingVMs(Number(this.userService.companyId))
    .subscribe({
      next:r=>{
        this.bookings=r;
        console.log(this.bookings);
        this.dataSource.data=this.bookings;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: err=>{
        this.notifyService.fail("Failed to load bokking summary", "DISMISS");
      }
    });
  
  }

}
