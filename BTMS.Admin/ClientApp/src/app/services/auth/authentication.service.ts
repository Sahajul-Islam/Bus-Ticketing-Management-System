import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { LoginDataModel } from 'src/app/models/authentication/login-data-model';
import { LoginModel } from 'src/app/models/authentication/login-model';
import { RegisterModel } from 'src/app/models/authentication/register-model';
import { UserModel } from 'src/app/models/authentication/user-model';
import { AppConstants } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject!: BehaviorSubject<UserModel>;
  private currentUser!: Observable<UserModel>;
  @Output() loginEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private http: HttpClient
  ) { 
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(sessionStorage.getItem("user-data") as string));
    this.currentUser = this.currentUserSubject.asObservable();

  }
  get currentUserValue() {
    return this.currentUserSubject.value;
  }
  getEmitter() {
    return this.loginEvent;
  }
  login(data: LoginModel) {
    let noTokenHeader = { headers: new HttpHeaders({ 'notoken': 'no token' }) }
    return this.http
      .post<any>(`${AppConstants.apiUrl}/Account/Login`, data, noTokenHeader)
      .pipe(map(v=>{
        let user = this.save(v);
          this.currentUserSubject.next(user);
          this.loginEvent.emit('login');
      }), catchError(this.handleError))
      /* .subscribe({
        next:(res: LoginDataModel) => {
          
          let user = this.save(res);
          this.currentUserSubject.next(user);
          this.loginEvent.emit('login');
        }, 
        error: err=>this.handleError(err)
      }); */
    
  }
  register(data:RegisterModel):Observable<any>
  {
    return this.http.post<any>(`${AppConstants.apiUrl}/Account/Register`, data);
  }
  save(data: any): LoginDataModel {
    const userdata:LoginDataModel = {};
    //console.log(new Date() >= new Date(data.expiration));
    userdata.accessToken = data.token;
    userdata.tokenExipres = new Date(data.expiration);
    userdata.refreshToken = data.refreshToken;
     const payload = JSON.parse(window.atob(data.token.split('.')[1])); 
    console.log(payload)
     userdata.userName = payload.username;
    userdata.conpanyId=payload.companyId;
    userdata.role = payload.role.split(",");
    
    sessionStorage.setItem("user-data", JSON.stringify(userdata)); 
    return userdata;
  }
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.currentUserSubject.next({});
    return throwError(()=> msg);
  }
  logout() {
    sessionStorage.removeItem("user-data");
    this.currentUserSubject.next({});
    this.loginEvent.emit('logout');
  }

}
