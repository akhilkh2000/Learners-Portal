import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from "@angular/common";
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isLoggedIn:boolean=false;
  name:string;
  role:string;
  isStudent:boolean=false;
  allMentors:boolean=false;
  imgUrl:string;
  gender:string;
  constructor(private location : Location,private _authService: AuthService, private router: Router) {}

  ngOnInit(): void {
     var currentPath = this.location.path() == "" ? this.location.path() : "/" + this.location.path().split("/")[1];
     if (currentPath.includes("allmentors")) this.allMentors=true; else this.allMentors=false;
    this.isLoggedIn=this._authService.loggedIn();
    this.name=this._authService.getUserName();
    this.role=this._authService.getRole();
    this.gender = this._authService.getGender();
    this.imgUrl = this._authService.getProfileImg(this.gender);
    this.isStudent=this.role=='student'?true:false;
  }
  goToDashboard(){
    if(this._authService.getRole()=="student")
      this.router.navigateByUrl("/sdashboard");
    if(this._authService.getRole()=="mentor")
      this.router.navigateByUrl("/mdashboard");
  }
  goToProfile(){
    if(this._authService.getRole()=="student")
      this.router.navigateByUrl("/sprofile");
    if(this._authService.getRole()=="mentor")
      this.router.navigateByUrl("/mprofile");
  }
  logout(){
    this._authService.logout();
    this.router.navigateByUrl("/");
  }
  openNav(){
    $(".wrapper").addClass("active");
  }
  closeNav(){
    $(".wrapper").removeClass("active");
  }
  detectNavAndSession(){
    var currentPath = this.location.path() == "" ? this.location.path() : "/" + this.location.path().split("/")[1];
    if (currentPath.includes("allmentors")) this.allMentors=true; else this.allMentors=false;
    this.closeNav();
    this.isLoggedIn=this._authService.loggedIn();
    if(!this.isLoggedIn){
      this.router.navigateByUrl("/login");
    }
  }

}
