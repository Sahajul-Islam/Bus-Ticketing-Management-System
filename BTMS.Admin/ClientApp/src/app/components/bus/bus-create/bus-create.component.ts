import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BusModel } from 'src/app/models/data/bus-model';

import { CompanyModel } from 'src/app/models/data/company-model';
import { BusType } from 'src/app/models/data/enums';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BusService } from 'src/app/services/data/bus.service';
import { CompanyService } from 'src/app/services/data/company.service';
import { AppConstants } from 'src/app/shared/app-constants';

@Component({
  selector: 'app-bus-create',
  templateUrl: './bus-create.component.html',
  styleUrls: ['./bus-create.component.css']
})
export class BusCreateComponent implements OnInit {
  busTypeOptions:{label:string,value:number}[]=[];
 
  bus:BusModel=
  {
    busId:undefined,
    busPlateNumber:'',
    busType:undefined,
    capacity:undefined,
    features:'',
    companyId:undefined,
    busModel:''
   
  }
  createForm:FormGroup=new FormGroup({
    busPlateNumber:new FormControl('', [Validators.required, Validators.maxLength(50)]),
    busType:new FormControl('',[Validators.required]),
    capacity:new FormControl('',[Validators.required]),
    features:new  FormControl('',[Validators.required,Validators.maxLength(50)]),
   
    busModel:new FormControl('',[Validators.required,Validators.maxLength(50)])
   
  })
  constructor(
    private busService:BusService,
    private companyService:CompanyService,
    private userService:UserService,
    private notifyService: NotifyService
    ) { }
  save(){
  
    if(this.createForm.invalid) return;
    //console.log(this.createForm.value)
    Object.assign(this.bus,this.createForm.value);
    this.bus.companyId = this.userService.companyId;
    //console.log(this.bus);
    this.busService.insert(this.bus)
    .subscribe({
      next: r=>{
        console.log(r);
        this.createForm.reset({});
        this.createForm.markAsUntouched();
        this.createForm.markAsPristine();
        this.bus= {
          busId:undefined, 
          busPlateNumber:'',
          busType:1,
          capacity:undefined,
          features:'',
          companyId:undefined,
          busModel:''
          
        }
        this.notifyService.success("Data Saved", "DISMISS")
      },
      error: err=>{
        console.error(err);
        this.notifyService.fail("Failed to save data", "DISMISS");
      }
    });
  }

  ngOnInit(): void {
    Object.keys(BusType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.busTypeOptions.push({ label: v, value: Number(BusType[v]) });
    });
    this.bus.companyId= this.userService.companyId;
  }

}
