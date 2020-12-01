import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  password:string=null;
  password2:string=null;
  resetToken:string=null;
  constructor(private _authService:AuthService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    //get token from snapshot of this route(tokenized route was sent in email)
    this.resetToken = this.route.snapshot.paramMap.get("token");
  }
  setNewPassword(){
    if(this.password!==this.password2) {
      alert("Password Mismatch.");
      return;
    }
    const data={
      password:this.password,
      token: this.resetToken
    }
    this._authService.setNewPassword(data).subscribe( res => {
      //setting new password 
      alert(res["res"]); //pass result returned by API into alert()
      this.router.navigateByUrl("/login");
    },
    (err:HttpErrorResponse) => { //error
      alert(err.error.res);
    });
    
  }
}
