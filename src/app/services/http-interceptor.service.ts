import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(req, next) {
    const token = this._authService.loggedIn()
      ? this._authService.getAuthToken()
      : "";
    //console.log(token);
    let authorizedReq = req.clone({
      setHeaders: {
        "x-auth-token": token,
      },
    });
    //console.log(authorizedReq);
    return next.handle(authorizedReq);
    //return next.handle(req);
  }
}