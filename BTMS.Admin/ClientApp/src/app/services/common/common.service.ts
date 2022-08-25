import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUserViewModel } from 'src/app/models/viewmodels/app-user-view-model';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http:HttpClient
  ) { }
  getUsers():Observable<AppUserViewModel[]>{
    return this.http.get<AppUserViewModel[]>(`${AppConstants.apiUrl}/Account/List`)

  }
}
