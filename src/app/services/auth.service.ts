import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serviceUrl=environment.serviceUrl+"/auth";
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) { }

  login(data){
    console.log(data);
    const API=this.serviceUrl+"/login";
    return this.http.post(API,data);
  }
  register(data){
    const API=this.serviceUrl+"/register";
    return this.http.post(API,data);
  }

  loggedIn() {
    //checks if token exists and verifies if its expired
    const token = this.getAuthToken();
    return !this.jwtHelper.isTokenExpired(token);
  }
  getAuthToken() {
    return localStorage.getItem("appToken");
  }
  saveAuthToken(token){
    localStorage.setItem("appToken",token);
    return;
  }
  getDecodedToken() {
    if (this.loggedIn()) return this.jwtHelper.decodeToken(this.getAuthToken());
  }

  isUserVerified() {
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken()).isVerified;
    else return false;
  }

  getRole() {
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken()).role;
    else return false;
  }

  getUserId(){
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken())._id;
  }

  getUserName(){
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken()).name;
  }
  getEmail(){
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken()).email;
  }
  getGender(){
    if (this.loggedIn())
      return this.jwtHelper.decodeToken(this.getAuthToken()).gender;
  }
  getProfileImg(gender){
    const f="https://randomuser.me/api/portraits/women/79.jpg";
    const m="https://i.imgur.com/A1Fjq0d.png";
    return ( gender=='f')?f:m;
  }

  logout() {
    localStorage.removeItem("appToken");
  }
  sendPasswordResetLink(data){
    const API = this.serviceUrl + "/sendPasswordResetLink";
    return this.http.post(API,data);
  }

  setNewPassword(data){
    const API = this.serviceUrl + "/resetPassword";
    return this.http.post(API,data);
  }

}
