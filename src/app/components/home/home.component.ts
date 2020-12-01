import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  toggleImg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAUVBMVEUAAAD///+kpKQKCgq0tLTDw8PW1tZ5eXnp6elFRUUMDAzb29t8fHx/f3/t7e2KiopOTk6WlpaqqqotLS1VVVW7u7vz8/PJycldXV2ysrI1NTXoJYLmAAABI0lEQVR4nO3cyW6DQBBFUQcyksHxFCf5/w/NukSrEAtcwT5n/xB3S6vZbAAAAAAAAAAAAFi9bZfafzY2u3yzuP1hTuHrXe5tPOk/JjaLe5lT+DjxsKdG4fNFMhIKFQYKSyhUGCgsoVBhoLCEQoWBwhIKFQYKSyhUGCgsoTCY+qr/Pp4MXxfJSMwq7Ic+M7Q2+WR5zZcCAAAAAODm7e5Tp+N40nf5ZnGn3zmFbiOs/+xJocISChUGCksoVBgoLKFQYaCwhEKFgcISChUGCksovLHCVd5GaP3aCQAAAAAArl73kDp/jyf9T75Z3NlthOD6z54UKiyhUGGgsIRChYHCEgoVBgpLKFQYKCyhUGGgsIRChUGjcFhXIQAAAAAAAAAAAP/SHw+OSZCeSGykAAAAAElFTkSuQmCC";
  loggedIn:boolean=false;
  role:string;
  constructor(private _authService:AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn=this._authService.loggedIn();
    this.role=this._authService.getRole();
  }

  toggleNav(){
    $("nav").slideToggle(400, function () {
      $(this).toggleClass("nav-expanded").css('display', '');
    });
  }
  closeMenu(){

  }
  logout(){
    this._authService.logout();
    this.loggedIn=false;
  }
  navigate(path){
    this.router.navigateByUrl(path);
  }
}
