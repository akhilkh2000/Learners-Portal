import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends:any;
  constructor(private _friendService: FriendService, private _authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this._friendService.getAllChat().subscribe( res=>{
      this.friends=res["res"];
      console.log(this.friends);
      const role=this._authService.getRole();
      
      this.friends.forEach(friend => {
        if(role=="student") friend.name=friend.mentorName;
        if(role=="mentor") friend.name=friend.studentName;
        friend.lastMsg=friend.messages.pop();
        friend.lastTime= new Date(friend.lastMsg.time).toLocaleDateString();
      });
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    })
  }

  openChat(friend:any){
    //console.log(friend);
    this.router.navigateByUrl("/chat/"+friend._id);
  }
}
