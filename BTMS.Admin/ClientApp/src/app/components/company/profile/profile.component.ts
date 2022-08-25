import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyModel } from 'src/app/models/data/company-model';
import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CompanyService } from 'src/app/services/data/company.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 company:CompanyModel= {companyId:undefined,companyName:'', companyEmail:'', companyAddress:'', companyPhoneNumber:'', accessKey:''}
 //form
 editForm:FormGroup = new FormGroup({
  companyName: new FormControl('', Validators.required),
  companyEmail: new FormControl('', [Validators.required, Validators.email]),
  companyAddress: new FormControl('', Validators.required),
  companyPhoneNumber: new FormControl('', Validators.required),
 });
  constructor(
    private companyService:CompanyService,
    private userService: UserService,
    private notifySevice: NotifyService
  ) { }
save(){
  if(this.editForm.invalid) return;
  Object.assign(this.company, this.editForm.value);
  //console.log(this.company);
  this.companyService.update(this.company)
  .subscribe({
    next:r=>{
      this.notifySevice.success("Data saved successfully", "DISMISS");
      this.editForm.markAsPristine();
      this.editForm.markAsUntouched();
    },
    error: err=>{
      this.notifySevice.fail("Falied to save data", "DISMISS");
    }
  })
}
  ngOnInit(): void {
    this.companyService.getById(Number(this.userService.companyId))
    .subscribe({
      next:r=>{
        this.company=r;
        //console.log(this.company);
        this.editForm.patchValue(this.company);
        console.log(this.editForm.value);
      },
      error: err=>{
        this.notifySevice.fail("Falied to load company data", "DISMISS");
      }
    });
  }

}
