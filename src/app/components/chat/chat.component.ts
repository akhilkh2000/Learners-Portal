import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy{
  chatId:string;
  messages:any;
  userId:string;
  senderName:string;
  chatObj:any;
  newMsg:string='';
  chatRefresher:any;
  profileLinker={name:'',profileId:''};
  constructor(private route: ActivatedRoute, private _friendService: FriendService,
    private router: Router, private _authService: AuthService) { }
    
  ngOnDestroy(): void {
    clearInterval(this.chatRefresher);
  }


  ngOnInit(): void {
    const role=this._authService.getRole();
    this.userId=this._authService.getUserId();
    this.chatId = this.route.snapshot.paramMap.get("chatId");
    if(!this.chatId){
      this.router.navigateByUrl("/friends");
      return;
    }

    this._friendService.getChat(this.chatId).subscribe( res=>{
      this.chatObj=res["res"];
      this.messages=this.chatObj.messages;
      if(role=="student") {
        this.senderName=this.chatObj.mentorName;
        this.profileLinker.name = this.chatObj.mentorName;
        this.profileLinker.profileId = this.chatObj.mentorId;
      }
      if(role=="mentor") {
        this.senderName=this.chatObj.studentName;
        this.profileLinker.name = this.chatObj.studentName;
        this.profileLinker.profileId = this.chatObj.studentId;
      }
      this.processMessages();
      setTimeout(this.scrollLast,100);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
    
   this.chatRefresher = setInterval(this.refreshChat.bind(this),5000);
  }

  processMessages(){
    this.messages.forEach(msg => {
      if(msg.sender===this.userId)
        msg.incoming=false;
      else msg.incoming=true;
      msg.date= new Date(msg.time).toLocaleDateString()
      msg.time= new Date(msg.time).toLocaleTimeString()
    });
    this.scrollLast()
  }

  sendMessage(){
    const role=this._authService.getRole();
    if(!this.newMsg || this.newMsg.length==0) return;
    const msg={
      text:this.newMsg
    }
    this._friendService.sendMessage(this.chatId,msg).subscribe(res =>{
      this.chatObj=res["res"];
      this.messages=this.chatObj.messages;
      if(role=="student") this.senderName=this.chatObj.mentorName;
      if(role=="mentor") this.senderName=this.chatObj.studentName;
      this.newMsg=null;
      this.processMessages();
    },
    (err:HttpErrorResponse)=>{
      alert("Message not sent.");
    });
  }

  scrollLast(){
    var myDiv = document.getElementById("chat-div");
    myDiv.scrollTop = myDiv.scrollHeight;
  }

  refreshChat(){
    const role=this._authService.getRole();
    this.userId=this._authService.getUserId();
    this.chatId = this.route.snapshot.paramMap.get("chatId");
    if(!this.chatId){
      this.router.navigateByUrl("/friends");
      return;
    }
    this._friendService.getChat(this.chatId).subscribe( res=>{
      this.chatObj=res["res"];
      this.messages=this.chatObj.messages;
      if(role=="student") this.senderName=this.chatObj.mentorName;
      if(role=="mentor") this.senderName=this.chatObj.studentName;
      this.processMessages();
      setTimeout(this.scrollLast,100);
    },
    (err:HttpErrorResponse)=>{
      alert(err.error.res);
    });
  }

  viewProfile(){
    const path="/pubprofile/"+this.profileLinker.profileId;
    this.router.navigateByUrl(path);
  }

}
