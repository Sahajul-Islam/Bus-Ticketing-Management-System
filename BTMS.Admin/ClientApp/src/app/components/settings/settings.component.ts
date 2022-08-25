
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MiscUtil } from 'src/app/models/common/misc-util';
import { CompanyModel } from 'src/app/models/data/company-model';
import { AppUserViewModel } from 'src/app/models/viewmodels/app-user-view-model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CompanyService } from 'src/app/services/data/company.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  //model
  companies:CompanyModel[]=[];
  users:AppUserViewModel[]=[];
  company:CompanyModel= {companyId:undefined,companyName:'', companyEmail:'', companyAddress:'', companyPhoneNumber:'', accessKey:'NA'}
  //company table
  dataSource:MatTableDataSource<CompanyModel>= new MatTableDataSource(this.companies);
  columnList:string[]= ["companyName", "accessKey", "companyAddress","companyPhoneNumber","companyEmail"];
  @ViewChild(MatSort, {static:true}) sortC:MatSort= new MatSort();
  @ViewChild(MatPaginator, {static:true}) paginatorC!:MatPaginator;
  //user table
  userDataSource:MatTableDataSource<AppUserViewModel>= new MatTableDataSource(this.users);
  @ViewChild(MatSort, {static:false}) sortU!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginatorU!:MatPaginator;
  columnListU:string[]= ["id", "userName", "role"];
  //---------------------
  regFormOpen:boolean = false;
  companyFormOpen:boolean = false;
  //---------------------
  regForm:FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [Validators.required,RxwebValidators.compare({fieldName:'password' })]),
    companyId: new FormControl(undefined, Validators.required)
  });
  
 //form
 companyForm:FormGroup = new FormGroup({
  companyName: new FormControl('', Validators.required),
  companyEmail: new FormControl('', [Validators.required, Validators.email]),
  companyAddress: new FormControl('', Validators.required),
  companyPhoneNumber: new FormControl('', Validators.required),
 });
  constructor(
    private companyService:CompanyService,
    private commonService:CommonService,
    private authService:AuthenticationService,
    private notifyService:NotifyService
  ) { }
  //user
  registerNew(){
    if(this.regForm.invalid) return;
    let data = {};
    Object.assign(data, this.regForm.value);
    this.authService.register(data)
    .subscribe({
      next: r=>{
        this.notifyService.success("User registered", "DISMISS");
        this.regForm.reset({});
        this.regForm.markAsUntouched();
        this.regForm.markAsPristine();
      }
    })

  }
  createCompanyNew(){
    if(this.companyForm.invalid) return;
    let data:CompanyModel= {companyId:undefined, companyName:'', accessKey:'NA', companyAddress:'', companyEmail:'', companyPhoneNumber:''};
    Object.assign(data, this.companyForm.value);
    console.log(data);
    this.companyService.create(data)
    .subscribe({
      next:r=>{
        this.notifyService.success("Data saved", "DISMISS");
        this.companyForm.reset({});
        this.companyForm.markAsPristine();
        this.companyForm.markAsUntouched();
        this.loadCompanies();
      }
    })

  }
  toggleRegform(){
      this.regFormOpen = !this.regFormOpen;
  }
  toggleCompanyform(){
    this.companyFormOpen = !this.companyFormOpen;
}
  loadCompanies(){
    this.companyService.get()
    .subscribe({
      next:r=>{
        this.companies=r;
        this.dataSource.data= this.companies;
        this.dataSource.sort=this.sortC;
        this.dataSource.paginator=this.paginatorC;
      },
      error:err=>{
        this.notifyService.fail("Failed to load copnay list", "DISMISS");
      }
    });
  }
  loadUsers(){
    this.commonService.getUsers()
    .subscribe({
      next:r=>{
        this.users=r;
        this.userDataSource.data= this.users;
        this.userDataSource.sort=this.sortU;
        this.userDataSource.paginator=this.paginatorU;
      },
      error:err=>{
        this.notifyService.fail("Failed to load users", "DISMISS");
      }
    });
  }
  ngOnInit(): void {
    this.loadCompanies();
    this.loadUsers();
  }

}
