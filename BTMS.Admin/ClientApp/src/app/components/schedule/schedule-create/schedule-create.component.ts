import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusModel } from 'src/app/models/data/bus-model';
import { BusRoute } from 'src/app/models/data/bus-route';


import { Schedule } from 'src/app/models/data/schedule';
import { ScheduleViewModel } from 'src/app/models/viewmodels/schedule-view-model';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BusRouteService } from 'src/app/services/data/bus-route.service';
import { BusService } from 'src/app/services/data/bus.service';
import { CompanyService } from 'src/app/services/data/company.service';
import { ScheduleService } from 'src/app/services/data/schedule.service';


@Component({
  selector: 'app-schedule-create',
  templateUrl: './schedule-create.component.html',
  styleUrls: ['./schedule-create.component.css']
})
export class ScheduleCreateComponent implements OnInit {
  //data form dropdown

  buses:BusModel[] =[];
  busRoutes:BusRoute[] =[]
  //model
  scheduleVM:ScheduleViewModel= { 
    scheduleId:undefined, 
    journeyDate:undefined, 
    departureTime:undefined, 
    minTimeToReportBeforeDeparture:undefined,
    fareAmount:undefined,
    busRoute:'',
    bus:'',
    busId:undefined,
    busRouteId:undefined
  };
  schedule!:Schedule;
  createForm:FormGroup = new FormGroup({
    journeyDate:new FormControl(undefined, Validators.required), 
    departureTime:new FormControl(undefined, Validators.required), 
    minTimeToReportBeforeDeparture:new FormControl(30, Validators.required),
    fareAmount:new FormControl(undefined, Validators.required),
   
    busId:new FormControl(undefined, Validators.required),
    busRouteId:new FormControl(undefined, Validators.required)
    
  });
  constructor(
    private scheduleService:ScheduleService,
    private notifyService:NotifyService,
   
    public userService:UserService,
    public busService:BusService,
    private busRouteService:BusRouteService,
    private datePipe:DatePipe
  ) { }
  //mathods
  loadDropDownData(){
    this.busService.getOfCompany(Number(this.userService.companyId))
    .subscribe({
      next:r=>{
        this.buses=r;
        console.log(r);
      },
      error:err=>{
        this.notifyService.fail("Failed to load bus data", "DISMISS");
      }
    });
    this.busRouteService.getOfCompany(Number(this.userService.companyId))
    .subscribe({
      next:r=>{
        this.busRoutes = r;
      },
      error:err=>{
        this.notifyService.fail("Failed to load route data", "DISMISS");
      }
    })
  }
  //handlers
  save(){
    if(this.createForm.invalid) return;
    console.log(this.createForm.value);
    Object.assign(this.scheduleVM, this.createForm.value);
    console.log(this.scheduleVM);
    this.scheduleVM.journeyDate= <string>this.datePipe.transform(this.scheduleVM.journeyDate, "yyyy-MM-dd");
    this.scheduleVM.departureTime=<string>this.datePipe.transform(this.scheduleVM.journeyDate, "yyyy-MM-dd")+ ' '+ this.scheduleVM.departureTime;
    this.scheduleService.insert(this.scheduleVM)
    .subscribe({
      next:r=>{
        console.log(r);
      },
      error:err=> {
        this.notifyService.fail("Failed to save data", "DISMISS");
      }
    })
  }
  ngOnInit(): void {
   
    this.loadDropDownData();
  }

}
