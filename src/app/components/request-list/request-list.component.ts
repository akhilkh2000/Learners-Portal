import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';
import { PaymentService } from 'src/app/services/payment.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CreatePaymentComponent } from '../create-payment/create-payment.component';
import { WinRefService } from 'src/app/services/win-ref.service';
@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  friendRequests:any;
  paymentRequests: any;
  role:string;
  bsModalRef: BsModalRef;
  hasFriendRequests:boolean=null;
  hasPaymentRequests:boolean=null;
  paymentDetails:any=null;
  constructor(private _friendService: FriendService, private _authService: AuthService,
    private _paymentService: PaymentService, private router: Router,
    private modalService: BsModalService, private winRef: WinRefService,
  ) { }

  ngOnInit(): void {
    const role= this._authService.getRole();
    this.role=role;

    this._friendService.getFriendRequests().subscribe( res=>{
      this.friendRequests=res["res"];
      if(this.friendRequests.length>0) this.hasFriendRequests=true; else  this.hasFriendRequests=false;
      this.processFriendRequests();
    },
    (err:HttpErrorResponse) =>{
      alert(err.error.res);
    });

    this._paymentService.getPaymentRequests().subscribe( res => {
      this.paymentRequests=res["res"];
      console.log(this.paymentRequests);
      if(this.paymentRequests.length>0) this.hasPaymentRequests=true; else  this.hasPaymentRequests=false;
      this.processFriendRequests();
    },
    (err:HttpErrorResponse) =>{
      alert(err.error.res);
    });


  }

  processFriendRequests(){
    const role= this._authService.getRole();
    this.friendRequests.forEach(req => {
      if(role=="student") req.requesterName=req.mentorName;
      else req.requesterName=req.studentName;
    });
  }

  deleteRequest(request){
    let status={};
    if(this.role=="student") status={status:"cancelled"};
    else status={status:"rejected"};
    this._friendService.updateFriendRequest(request._id,status).subscribe( res =>{
      alert(res["res"]);
      request.status=status["status"];
    },
    (err: HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }
  acceptRequest(request){
    let status={};
    if(this.role=="mentor") status={status:"accepted"};
    else return;
    this._friendService.updateFriendRequest(request._id,status).subscribe( res =>{
      alert(res["res"]);
      request.status=status["status"];
      window.location.reload();
    },
    (err: HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }

  resendRequest(request){
    let status={};
    if(this.role=="student") status={status:"requested"};
    else return;
    this._friendService.updateFriendRequest(request._id,status).subscribe( res =>{
      alert(res["res"]);
      request.status=status["status"];
    },
    (err: HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }

  withdrawPayment(payment){

  }

  initiatePayment(payment){
    
  }

  createNewPaymentRequest() {
    const initialState = {
      title: "Create New Payment Request",
    };
    this.bsModalRef = this.modalService.show(CreatePaymentComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = "Close";
  }


  completePayment(paymentObj){
    console.log(paymentObj);
    this.paymentDetails=paymentObj;
    var ref=this;
    var options = {
      "key": "rzp_test_csrqUvCcuwCD21", // 
      "amount": paymentObj.amount*100, // 
      "currency": paymentObj.currency,
      "name": "Learners-Portal",
      "description": paymentObj.items,
      "order_id": paymentObj.orderId, 
      "handler": function paymentResponseHandler(response){
            if(response.error){
              alert("Payment-Failed");
              this.paymentDetails=null;
            }
            else{
              ref.processPayment(response.razorpay_payment_id);
            }
      },
      "prefill": {
          "email": this._authService.getEmail(),
      },
      "notes": {
          "address": "www.learners-portal.web.app"
      },
    };
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  processPayment(rz_paymentId){
    var ref=this;
    if(rz_paymentId){
      this._paymentService.acceptPayments({orderId:this.paymentDetails.orderId,paymentId:rz_paymentId,trxId:this.paymentDetails._id})
        .subscribe( res=>{
          alert("Payment-Successfull");
          this.paymentDetails=null;
          this.refreshAndClose();
        },
        (err:HttpErrorResponse)=>{
          alert("Payment Failed.Please retry..");
          this.paymentDetails=null;
        })
    }
  }
  refreshAndClose(): void {
    window.location.reload();
    this.router.navigateByUrl("/requestList");
  }


}
