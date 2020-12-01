import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  userId:string;
  userProfile:any;
  extras:any;
  constructor(private route: ActivatedRoute, private _profileService: ProfileService,
    private router: Router, private _authService: AuthService, private _friendService: FriendService) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get("userId");
    this._profileService.getPublicProfile(this.userId).subscribe( res=>{
      this.userProfile=res["res"].profile;
      this.extras=res["res"].extras;
      this.userProfile.imgUrl = this._authService.getProfileImg(this.userProfile.gender);
      if(this.extras.isRated){
        var ratings = this.userProfile.ratings;
        const authId = this._authService.getUserId();
        const idx = ratings.findIndex((element) => element.userId == authId);
        if(idx>=0){
          let data = ratings[idx];
          this.extras.myReview = {
            rating: data.rating ,
            comment : data.comment
          };
          console.log(data);
          console.log(this.extras.myReview);
        }
      }
    },
    (err:HttpErrorResponse) => {
      alert(err.error.res);
    });
    
  }

  sendMessage(){
    this._friendService.getChatId(this.userId).subscribe( res => {
      this.router.navigateByUrl("/chat/"+res["res"]);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }
  sendRequest(){
    const data={
      mentorId:this.userId
    };
    this._friendService.sendFriendRequest(data).subscribe( res=>{
      alert(res["res"]);
    },
    (err:HttpErrorResponse)=>{
      console.log(err.error.res)
      //alert(err.error.res);
    })
  }

  rateMentor(data){
    if(!data.comment) data.comment='';
    if(data.rating>5 || data.rating<1){
      alert("Rating must be in range 1 to 5");
      return;
    }
    this._profileService.rateMentor(this.userProfile.userId, data).subscribe( res =>{
      alert("Rating Submitted.");
      this.refresh();
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    })
  }

  refresh(): void {
    window.location.reload();
  }

}
