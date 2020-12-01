import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email:string=null;
  constructor(private _authService : AuthService) { }

  ngOnInit(): void {
  }
  initiatePasswordReset(){
    if(!this.email) return;
    const data={
      email:this.email
    };
    this._authService.sendPasswordResetLink(data).subscribe(res =>{
      alert(res["res"]);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    })

  }
}
