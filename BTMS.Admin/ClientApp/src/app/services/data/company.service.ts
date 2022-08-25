import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyModel } from 'src/app/models/data/company-model';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http:HttpClient
  ) { }
  get():Observable<CompanyModel[]>{
    return this.http.get<CompanyModel[]>(`${AppConstants.apiUrl}/Companies`);
  }
  getById(id:number):Observable<CompanyModel>{
    return this.http.get<CompanyModel>(`${AppConstants.apiUrl}/Companies/${id}`);
  }
  create(data:CompanyModel):Observable<CompanyModel>{
    return this.http.post<any>(`${AppConstants.apiUrl}/Companies`, data);
  }
  update(data:CompanyModel):Observable<any>{
    return this.http.put<any>(`${AppConstants.apiUrl}/Companies/${data.companyId}`, data);
  }
}
