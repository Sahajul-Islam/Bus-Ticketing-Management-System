import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/auth/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let notoken = req.headers.get('notoken');
    if (notoken == null && this.userService.isLogged) {
      
      let token = this.userService.token;
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
