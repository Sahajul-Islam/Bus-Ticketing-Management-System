import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@angular/cdk/layout';

import { AppHomeComponent } from './components/home/app-home/app-home.component';
import { MatImportModule } from './modules/mat-import/mat-import.module';

import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MultilevelMenuService, NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BusViewComponent } from './components/bus/bus-view/bus-view.component';
import { BusCreateComponent } from './components/bus/bus-create/bus-create.component';
import { BusEditComponent } from './components/bus/bus-edit/bus-edit.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationService } from './services/auth/authentication.service';
import { UserService } from './services/auth/user.service';
import { NotifyService } from './services/common/notify.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './services/data/company.service';
import { ProfileComponent } from './components/company/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CommonService } from './services/common/common.service';
import { BusService } from './services/data/bus.service';
import { BusRouteViewComponent } from './components/bus-route/bus-route-view/bus-route-view.component';
import { BusRouteCreateComponent } from './components/bus-route/bus-route-create/bus-route-create.component';
import { BusRouteService } from './services/data/bus-route.service';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BusRouteEditComponent } from './components/bus-route/bus-route-edit/bus-route-edit.component';
import { ScheduleService } from './services/data/schedule.service';
import { ScheduleViewComponent } from './components/schedule/schedule-view/schedule-view.component';
import { ScheduleCreateComponent } from './components/schedule/schedule-create/schedule-create.component';
import { ScheduleEditComponent } from './components/schedule/schedule-edit/schedule-edit.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BookingViewComponent } from './components/booking/booking-view/booking-view.component';
import { BookingCreateComponent } from './components/booking/booking-create/booking-create.component';
import { BookingEditComponent } from './components/booking/booking-edit/booking-edit.component';
import { BookingService } from './services/data/booking.service';
import { SignalRService } from './services/common/signal-r.service';
import { TicketViewComponent } from './components/ticket/ticket-view/ticket-view.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AppHomeComponent,
    BusViewComponent,
    BusCreateComponent,
    BusEditComponent,
    LoginComponent,
    ProfileComponent,
    SettingsComponent,
    BusRouteViewComponent,
    BusRouteCreateComponent,
    BusRouteEditComponent,
    ScheduleViewComponent,
    ScheduleCreateComponent,
    ScheduleEditComponent,
    ConfirmDialogComponent,
    BookingViewComponent,
    BookingCreateComponent,
    BookingEditComponent,
    TicketViewComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
   
    NgMaterialMultilevelMenuModule, 
    MatNativeDateModule,
	  RxReactiveFormsModule,
    MatImportModule,
    NgxMaterialTimepickerModule
   
  ],
  providers: [
    DatePipe,
    HttpClient,
    MultilevelMenuService,
    AuthenticationService,
    UserService,
    CompanyService,
    BusService,
    CommonService,
    BusRouteService,
    ScheduleService,
    BookingService,
    NotifyService,
    SignalRService,{
      provide: APP_INITIALIZER,
      useFactory: (signalrService: SignalRService) => () => signalrService.intializeConnection(),
      deps: [SignalRService],
      multi: true,
    },
    {provide:HTTP_INTERCEPTORS, useClass:JwtInterceptor, multi:true}
  ],
  entryComponents:[ConfirmDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
