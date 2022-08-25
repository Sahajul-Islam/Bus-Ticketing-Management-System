import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookingSummaryViewModel } from 'src/app/models/viewmodels/booking-summary-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BookingService } from 'src/app/services/data/booking.service';

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.css']
})
export class BookingViewComponent implements OnInit {
  date:Date = new Date();
  //model
  bookingData:BookingSummaryViewModel[] =[];
  //------------------------------
  dataSource:MatTableDataSource<BookingSummaryViewModel> = new MatTableDataSource(this.bookingData);
  columnList:string[] =["scheduleTime", "company", "bus", "capacity" ,"actions"];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  //form
  dateFilterForm:FormGroup =new FormGroup({
    date: new FormControl(this.date, Validators.required)
  });
  constructor(
    private bookingService:BookingService,
    private notifyService:NotifyService,
    private datePipe:DatePipe
  ) { }
  show(){
    if(this.dateFilterForm.invalid) return;
    this.date =this.dateFilterForm.controls["date"].value;
    this.loadBookings();
  }
  loadBookings(){
    let dt:string =String( this.datePipe.transform(this.date, 'yyyy-MM-dd'));
    this.bookingService.getSummaryOfDate(dt)
    .subscribe({
      next:r=>{
        this.bookingData=r;
        console.log(this.bookingData);
        this.dataSource.data=this.bookingData;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: err=>{
        this.notifyService.fail("Failed to load bokking summary", "DISMISS");
      }
    })
  }
  ngOnInit(): void {
    this.loadBookings();
  }

}
