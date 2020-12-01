import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register(data){
    if(!data.role || !data.name || !data.email || !data.password) {
      alert("All fields are required.");
      return;
    }
    if(data.role==='student'){
      data.regCode= data.regCode.toUpperCase();
      var regex= "^(PES)[0-9]{10}$" ;
      let re = new RegExp(regex);
      if(!re.test(data.regCode) ){
        alert("Invalid university registration Code");
        return;
      }
    }
    data.role=data.role.toLowerCase();
    if(data.password!==data.repeatPassword){
      alert("Passwords must match");
      return;
    }
    else delete data.repeatPassword;
    if(!(data.role==="student" || data.role==="mentor")){
      alert("Not a valid role.");
      return;
    }
    this._authService.register(data).subscribe( res =>{
      alert("Registration Successfull. Please login.");
      this.router.navigateByUrl("/login");
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }

}
