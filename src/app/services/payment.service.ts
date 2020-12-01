import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  serviceUrl:string=environment.serviceUrl +"/payment";
  constructor(private http : HttpClient) { }

  createOrder(orderDetail){
    const API = this.serviceUrl + "/createOrder";
    return this.http.post(API, orderDetail);
  }

  acceptPayments(paymentDetail){
    const API = this.serviceUrl+"/acceptPayment";
    return this.http.post(API,paymentDetail);
  }

  getPaymentRequests(){
    const API = this.serviceUrl+"/paymentRequests";
    return this.http.get(API);
  }
  getTransactions(){
    const API = this.serviceUrl+"/transactions";
    return this.http.get(API);
  }
}
