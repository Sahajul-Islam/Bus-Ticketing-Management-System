import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppConstants } from 'src/app/shared/app-constants';
import { UserService } from 'src/app/services/auth/user.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  appName=AppConstants.appName;
  navItems = AppConstants.navItems;
  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,

    fontColor: `rgb(8, 54, 71)`,


    highlightOnSelect: true,
    collapseOnSelect: true,
    useDividers: true,
    rtlLayout: false
  };
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private loginService:AuthenticationService,
    private router:Router
    ) {}
    get isLogged(){
      return this.userService.isLogged;
    }
    get userName():string{
      return this.userService.userName;
    }
    get isAdmin(){
      return this.userService.isAdmin;
    }
    logout(){
      console.log('logout');
      this.loginService.logout();
      this.router.navigateByUrl("/login");
    }

}
