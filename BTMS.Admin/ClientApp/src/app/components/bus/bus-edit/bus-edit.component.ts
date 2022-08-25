import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { BusModel } from 'src/app/models/data/bus-model';
import { BusType } from 'src/app/models/data/enums';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { BusService } from 'src/app/services/data/bus.service';
import { CompanyService } from 'src/app/services/data/company.service';



@Component({
  selector: 'app-bus-edit',
  templateUrl: './bus-edit.component.html',
  styleUrls: ['./bus-edit.component.css']
})
export class BusEditComponent implements OnInit {
  
  data!:BusModel;
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
  editForm:FormGroup=new FormGroup({
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
    private notifyService: NotifyService,
    private activatedRoute:ActivatedRoute
    ) { }
  save(){
  
    if(this.editForm.invalid) return;
    //console.log(this.createForm.value)
    Object.assign(this.bus,this.editForm.value);
    this.bus.companyId = this.userService.companyId;
    //console.log(this.bus);
    this.busService.update(this.bus)
    .subscribe({
      next: r=>{
        console.log(r);
        
        this.notifyService.success("Data Saved", "DISMISS")
      },
      error: err=>{
        console.error(err);
        this.notifyService.fail("Failed to save data", "DISMISS");
      }
    });
  }

  ngOnInit(): void {


    let id:number = this.activatedRoute.snapshot.params["id"];
    this.busService
    .getById(id)
    .subscribe({
      next:r=> {
        this.data= r;
        Object.assign(this.bus, this.data);
        
        this.editForm.controls["busPlateNumber"].patchValue(this.bus.busPlateNumber);
        this.editForm.controls["busType"].patchValue(this.bus.busType);
        this.editForm.controls["capacity"].patchValue(this.bus.capacity);
        this.editForm.controls["features"].patchValue(this.bus.features);
        this.editForm.controls["busModel"].patchValue(this.bus.busModel);
        //this.editForm.controls["companyId"].patchValue(this.bus.companyId);
        //this.editForm.controls["busId"].patchValue(this.bus.busId);

        console.log(this.editForm.value);
      },
      error:err=>{
        this.notifyService.fail('Failed to bous route data', 'DISMISS');
    }})
    Object.keys(BusType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.busTypeOptions.push({ label: v, value: Number(BusType[v]) });
    });
    this.bus.companyId= this.userService.companyId;

  }


  
}
