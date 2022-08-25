import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Schedule } from 'src/app/models/data/schedule';
import { ScheduleViewModel } from 'src/app/models/viewmodels/schedule-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { ScheduleService } from 'src/app/services/data/schedule.service';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.css']
})
export class ScheduleViewComponent implements OnInit {
  //globals
  date:Date = new Date();
  //model data
  schedules:ScheduleViewModel[] =[];
  //table
  dataSource:MatTableDataSource<ScheduleViewModel> = new MatTableDataSource(this.schedules);
  columnList:string[] =["journeyDate", "departureTime", "minTimeToReportBeforeDeparture", "busRoute", "bus" ,"actions"];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;

  //form
  dateFilterForm:FormGroup =new FormGroup({
    date: new FormControl(this.date, Validators.required)
  });

  constructor(
    private scheduleService:ScheduleService,
    private notifyService:NotifyService,
    private datePipe:DatePipe
  ) { }

  //methods
  loadSchedules(){
    let dt:string =String( this.datePipe.transform(this.date, 'yyyy-MM-dd'));
    console.log(dt);
    this.scheduleService.getVMByDate(dt)
    .subscribe({
      next:r=>{
        this.schedules=r;
        //console.log(this.schedules);
        this.dataSource.data=this.schedules;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: err=>{
        this.notifyService.fail("Failed to load schedules", "DISMISS");
      }
    })
  }
  //handlers
  show(){
    if(this.dateFilterForm.invalid) return;
    this.date = this.dateFilterForm.controls["date"].value;
    this.loadSchedules();
  }
  ngOnInit(): void {
    this.loadSchedules();
  }

}
