import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingCreateComponent } from './components/booking/booking-create/booking-create.component';
import { BookingEditComponent } from './components/booking/booking-edit/booking-edit.component';
import { BookingViewComponent } from './components/booking/booking-view/booking-view.component';
import { BusRouteCreateComponent } from './components/bus-route/bus-route-create/bus-route-create.component';
import { BusRouteEditComponent } from './components/bus-route/bus-route-edit/bus-route-edit.component';
import { BusRouteViewComponent } from './components/bus-route/bus-route-view/bus-route-view.component';
import { BusCreateComponent } from './components/bus/bus-create/bus-create.component';
import { BusEditComponent } from './components/bus/bus-edit/bus-edit.component';
import { BusViewComponent } from './components/bus/bus-view/bus-view.component';
import { ProfileComponent } from './components/company/profile/profile.component';
import { AppHomeComponent } from './components/home/app-home/app-home.component';
import { LoginComponent } from './components/login/login.component';
import { ScheduleCreateComponent } from './components/schedule/schedule-create/schedule-create.component';
import { ScheduleEditComponent } from './components/schedule/schedule-edit/schedule-edit.component';
import { ScheduleViewComponent } from './components/schedule/schedule-view/schedule-view.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TicketViewComponent } from './components/ticket/ticket-view/ticket-view.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'', component: AppHomeComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path:'home', component:AppHomeComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path:'login', component:LoginComponent},
  {path: 'company-profile', component:ProfileComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'buses', component:BusViewComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path: 'bus-create', component:BusCreateComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'bus-edit/:id', component:BusEditComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'settings', component:SettingsComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin"] }},
  {path: 'bus-routes', component:BusRouteViewComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path: 'bus-route-create', component:BusRouteCreateComponent, canActivate: [AuthGuard], data: { AllowedRoles: [ "Agent"] }},
  {path: 'bus-route-edit/:id', component:BusRouteEditComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'schedules', component:ScheduleViewComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path: 'schedule-create', component:ScheduleCreateComponent, canActivate: [AuthGuard], data: { AllowedRoles: [ "Agent"] }},
  {path: 'schedule-edit/:id', component:ScheduleEditComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'bookings', component:BookingViewComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Admin", "Agent"] }},
  {path: 'booking-create/:id', component:BookingCreateComponent, canActivate: [AuthGuard], data: { AllowedRoles: [ "Agent"] }},
  {path: 'booking-edit/:id', component:BookingEditComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }},
  {path: 'tickets', component:TicketViewComponent, canActivate: [AuthGuard], data: { AllowedRoles: ["Agent"] }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
