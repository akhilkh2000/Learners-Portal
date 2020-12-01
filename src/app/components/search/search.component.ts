import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchPipe } from '../../pipes/search.pipe';
import { FriendService } from 'src/app/services/friend.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  mentors:any;
  searchWord:string=null;
  constructor( private _friendService: FriendService,private _authService:AuthService, private _profileService : ProfileService, private router:Router) { }

  ngOnInit(): void {
    this._profileService.getAllMentors().subscribe( res=>{
      this.mentors=res["res"];
      this.mentors.forEach(item => {
        for(var i=0; i < item.info.length;i++)
          if(item.info[i].title=='country') item.country=item.info[i].value;
        item.imgUrl = this._authService.getProfileImg(item.gender);
      });
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    })
  }

  sendMessage(mentor){
    this._friendService.getChatId(mentor.userId).subscribe( res => {
      this.router.navigateByUrl("/chat/"+res["res"]);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }
  sendRequest(mentor){
    const data={
      mentorId:mentor.userId
    };
    this._friendService.sendFriendRequest(data).subscribe( res=>{
      alert(res["res"]);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    })
  }

  getTopSkills(arr,n){
    let subarr=[];
    if(arr.length==0){
      subarr.push("No Skills to Show.");
      return subarr;
    }
    const limit=arr.length>n?n:arr.length;
    for(var i=0;i<limit;i++)
      subarr.push(arr[i]);
    subarr.push("more...");
    return subarr;
  }

}
