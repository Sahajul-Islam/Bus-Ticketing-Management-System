import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/auth/user.service';
import { NotifyService } from '../services/common/notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router:Router,
    private userService: UserService,
    private notifyService:NotifyService
    
    ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.userService.load();
    
      if (this.userService.isLogged) {
        //console.log(route.data.AllowedRoles);
        
        if (route.data['AllowedRoles'] && !this.userService.roleMatch(route.data['AllowedRoles'])) {
          this.notifyService.fail("Forbidden: you are not allwed to access the resource", "DISMISS");
          return false;
        }
  
        return true;
      }
      else {
        this.notifyService.fail("You must login to access the resource.", "DISMISS")
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
  }
  
}
