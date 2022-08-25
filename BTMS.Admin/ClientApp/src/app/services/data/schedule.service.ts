import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Schedule } from 'src/app/models/data/schedule';
import { ScheduleViewModel } from 'src/app/models/viewmodels/schedule-view-model';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http:HttpClient) { }
  get():Observable<Schedule[]>{
    return this.http.get<Schedule[]>(`${AppConstants.apiUrl}/Schedules`)
  }
  getVM():Observable<ScheduleViewModel[]>{
    return this.http.get<ScheduleViewModel[]>(`${AppConstants.apiUrl}/Schedules/VM`)
  }
  getVMByDate(date:string):Observable<ScheduleViewModel[]>{
    return this.http.get<ScheduleViewModel[]>(`${AppConstants.apiUrl}/Schedules/VM/${date}`)
  }
  insert(data:ScheduleViewModel):Observable<Schedule>{
    return this.http.post<Schedule>(`${AppConstants.apiUrl}/Schedules/VM`, data);
  }
}
