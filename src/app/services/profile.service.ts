import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  serviceUrl=environment.serviceUrl+"/profile";
  constructor(private http: HttpClient) { }

  getMentors(){
    const API = this.serviceUrl + "/recommended";
    return this.http.get(API);
  }
  getAllMentors(){
    const API = this.serviceUrl + "/allmentors";
    return this.http.get(API);
  }
  getPublicProfile(userId){
    const API=this.serviceUrl + "/public/"+userId;
    return this.http.get(API);
  }
  getProfile(){
    const API=this.serviceUrl;
    return this.http.get(API);
  }
  rateMentor(mentorId,data){
    const API= this.serviceUrl +"/rate/"+mentorId;
    return this.http.post(API,data);
  }
  editProfile(userProfile){
    const API = this.serviceUrl;
    return this.http.put(API,userProfile);
  }
}
