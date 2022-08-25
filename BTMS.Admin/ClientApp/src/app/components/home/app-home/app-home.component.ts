import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/services/auth/user.service';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CompanyService } from 'src/app/services/data/company.service';


@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent implements OnInit {
  companyName:string = '';
  constructor(
   private userService:UserService,
   private companyService:CompanyService,
   private notifyService:NotifyService
  ) { }

  ngOnInit(): void {
    if(this.userService.isLogged){
     
      if(this.userService.isAdmin) this.companyName="Admin Panel";
      else {
        this.companyService.getById(Number(this.userService.companyId))
        .subscribe({
          next: r=>{
            this.companyName= r.companyName;
          },
          error: err =>{
            this.notifyService.fail("Failed to load company data", "DISMISS");
          }
        })
      }
    }
  
      

  }

}
