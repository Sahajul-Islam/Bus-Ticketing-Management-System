import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusModel } from 'src/app/models/data/bus-model';

import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class BusService {
 
  constructor(
    private http:HttpClient
  ) { }
  get():Observable<BusModel[]>{
    return this.http.get<BusModel[]>(`${AppConstants.apiUrl}/Buses`);
  }
  getOfCompany(id:number):Observable<BusModel[]>{
    return this.http.get<BusModel[]>(`${AppConstants.apiUrl}/Buses/Company/${id}`);
  }
  getById(id:number):Observable<BusModel>{
    return this.http.get<BusModel>(`${AppConstants.apiUrl}/Buses/${id}`);
  }
  insert(bus:BusModel):Observable<BusModel>{
    return this.http.post<BusModel>(`${AppConstants.apiUrl}/Buses`, bus);
  }
  update(bus:BusModel):Observable<any>{
    return this.http.put<any>(`${AppConstants.apiUrl}/Buses/${bus.busId}`, bus);
  }
  delete(id:number):Observable<BusModel>{
    return this.http.delete<BusModel>(`${AppConstants.apiUrl}/Buses/${id}`);
  }
}
