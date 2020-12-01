import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SguardGuard implements CanActivate {
  constructor(  private _authService: AuthService, private router: Router ){}
  canActivate(): boolean {
    if(this._authService.loggedIn()){
      if(this._authService.getRole()=="student") return true;
      else return false;
    }
    else{
      this.router.navigateByUrl("/login");
      return false ;
    }
  }
  
}
