import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ProfileService } from 'src/app/services/profile.service';
import { WinRefService } from 'src/app/services/win-ref.service'
@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.css']
})
export class CreatePaymentComponent implements OnInit {
  title:string = "Create New Payment request";
  students:any=[];
  newPayment:any= { title:null,amount:null, requestedTo: 'Choose payee' }
  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private _authService: AuthService,
    private router: Router,
    private _friendService : FriendService,
    private _paymentService : PaymentService,
    private winRef: WinRefService,
    ) { }

  ngOnInit(): void {
    this._friendService.getFriends().subscribe( res => {
      this.students = res["res"];
      console.log(this.students);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }
  
  createRequest() {
    console.log(this.newPayment);
    this._paymentService.createOrder(this.newPayment).subscribe( res => {
      //alert(res["res"]);
      this.refreshAndClose();
    },
    (err : HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }

  addContest() {

  }
  editContest() {

  }
  disableSubmit() {}
  closeModal() {
    this.bsModalRef.hide();
    this.router.navigateByUrl("/requestList");
  }
  refreshAndClose(): void {
    window.location.reload();
    this.bsModalRef.hide();
    this.router.navigateByUrl("/requestList");
  }
}
