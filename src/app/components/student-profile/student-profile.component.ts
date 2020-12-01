import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
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

    editProfile(type){
      this.router.navigateByUrl("/profile/edit/"+this.userId);
    }

    openLink(url:string){
      if(!url.includes('https://')) url='https://'+url;
      window.open(url, "_blank");
    }
}
