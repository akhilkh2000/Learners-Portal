import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _authService:AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login(data){
    this._authService.login(data).subscribe(res=>{
      //console.log(res);
      this._authService.saveAuthToken(res["res"]);
      if(this._authService.getRole()=="student")
        this.router.navigateByUrl("/sdashboard");
      if(this._authService.getRole()=="mentor")
       this.router.navigateByUrl("mdashboard");
    },
    (err:HttpErrorResponse)=>{
      //console.log(err);
      alert(err.error.res);
    })

  }

}
