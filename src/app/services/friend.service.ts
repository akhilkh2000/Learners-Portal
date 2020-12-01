import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  private serviceUrl = environment.serviceUrl + "/friend";
  constructor(private http: HttpClient) { }

  getMentors(){
    const API=this.serviceUrl + "/mentor";
    return this.http.get(API);
  }

  getAllChat(){
    const API=this.serviceUrl + "/chat";
    return this.http.get(API);
  }
  getChat(chatId){
    const API=this.serviceUrl+"/chat/"+chatId;
    return this.http.get(API);
  }

  sendMessage(chatId,message){
    const API=this.serviceUrl+"/chat/"+chatId;
    return this.http.post(API,message);
  }
  getFriendRequests(){
    const API=this.serviceUrl+"/request";
    return this.http.get(API);
  }

  getPaymentRequests(){
    const API=this.serviceUrl+"/request";
    return this.http.get(API);
  }

  sendFriendRequest(data){
    const API=this.serviceUrl+"/request";
    return this.http.post(API,data);
  }
  getChatId(mentorId){
    const API=this.serviceUrl+"/getChatId/"+ mentorId;
    return this.http.get(API);
  }
  updateFriendRequest(requestId,status){
    console.log(status);
    const API=this.serviceUrl +"/request/"+ requestId;
    return this.http.put(API,status)
  }

  getFriends(){
    const API=this.serviceUrl ;
    return this.http.get(API)
  }
}
