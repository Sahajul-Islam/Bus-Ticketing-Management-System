import { Injectable } from '@angular/core';
import { LoginDataModel } from 'src/app/models/authentication/login-data-model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user!:LoginDataModel;
  constructor(
    private authenticationService: AuthenticationService
  ) { 
    this.load();
    //console.log(this.user);
    this.authenticationService.getEmitter().subscribe(x => {
      if (x === "login") {
        //console.log("login");
        this.load();
      }
      if (x === "logout") {
        this.user = {};
      }
     
    });
  }
  get isLogged() {
    //console.log(this.user.userName);
    return this.user?.userName != null;
  }
  get userName() {
    return this.user?.userName ?? '';
  }
  get token() {
    return this.user?.accessToken ?? '';
  }
  get role() {
    return this.user?.role;
  }
  get isAdmin() {
    let i = this.user?.role?.indexOf('Admin');
      
    return i!=null && i>=0;
  }
  get expiration(): Date | null  {
    return this.user?.tokenExipres ?? null;
  }
  get companyId(): number | undefined{
    return this.user?.conpanyId;
  }
  load() {
    this.user = this.authenticationService.currentUserValue;
    //console.log(this.user);
  }
  logout() {
    this.authenticationService.logout();
  }
  roleMatch(allowedRoles: string[]) {
    console.log(allowedRoles);
    let isMatch = false;
    for (const r of allowedRoles) {
      console.log(r);
      console.log(this.role);
      let i = this.role?.indexOf(r);
      console.log(i);
      if (i !=undefined && i>=0) {
        isMatch = true;
        break;
      }
    }
    console.log(`$Math: ${isMatch}`);
    return isMatch;
  }
}
