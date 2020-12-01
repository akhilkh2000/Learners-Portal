import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userId:string;
  userProfile:any;
  extras:any;
  skills:string;
  constructor(private route: ActivatedRoute, private _profileService: ProfileService,
    private router: Router, private _authService: AuthService, private _friendService: FriendService) { }

  ngOnInit(): void {
    this.userId = this._authService.getUserId();
    this._profileService.getProfile().subscribe( res=>{
      //loads current profile 
      this.userProfile=res["res"].profile;
      this.skills= this.userProfile.skills.join(",");
      this.extras=res["res"].extras;
    },
    (err:HttpErrorResponse) => {
      alert(err.error.res);
    });
  }

  saveDetails(){
    let newSkills=[];
    let tempSkills = this.skills.split(",");
    for(var i=0;i<tempSkills.length;i++)
      if(tempSkills[i].length>0) newSkills.push(tempSkills[i].trim());
    this.userProfile.skills=newSkills;
    this._profileService.editProfile(this.userProfile).subscribe( res =>{
      //going back after changing skills in DB
      window.history.back();
    },(err:HttpErrorResponse)=>{
      alert(err.error.res);
    })
  }

}
