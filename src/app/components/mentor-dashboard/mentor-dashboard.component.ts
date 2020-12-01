import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-mentor-dashboard',
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {
  role;string;
  userId:string;
  userProfile:any;
  extras:any;
  transactions:any;
  transactionExtras:any;
  constructor(private route: ActivatedRoute, private _profileService: ProfileService,
    private router: Router, private _authService: AuthService, private _friendService: FriendService,
    private _paymentService : PaymentService) { }

  ngOnInit(): void {
    this.userId = this._authService.getUserId();
    this.role= this._authService.getRole();
    this._profileService.getProfile().subscribe( res=>{
      this.userProfile=res["res"].profile;
      this.extras=res["res"].extras;
      this.userProfile.imgUrl = this._authService.getProfileImg(this.userProfile.gender);
    },
    (err:HttpErrorResponse) => {
      alert(err.error.res);
    });

    /* Trx details */
    this._paymentService.getTransactions().subscribe( res=>{
      this.transactions = res;
      this.transactionExtras = this.transactions.extras;
      this.transactions = this.transactions.res;
      console.log(this.transactionExtras)
      console.log(this.transactions)
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

  editProfile(type){
    this.router.navigateByUrl("/profile/edit/"+this.userId);
  }
  openLink(url:string){
    if(!url.includes('https://')) url='https://'+url;
    window.open(url, "_blank");
  }
}
