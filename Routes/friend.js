const express = require("express");
const router = express.Router();
const {Friend,validateFriend}=require("../Models/Friend");
const authenticator=require("../Middlewares/authenticator");
const sAuthenticator=require("../Middlewares/sAuthenticator");
const mAuthenticator=require("../Middlewares/mAuthenticator");
const { User } = require("../Models/User");


// Sending friend-request
router.post("/request",[authenticator], async (req,res)=>{
    const studentId=req.user._id;
    const mentorId=req.body.mentorId;
    try{
        if(req.user.role=="mentor") return res.status(401).send({res:"Mentor cannot send requests"});
        const friend = await Friend.findOne({studentId:studentId,mentorId:mentorId});
        if(friend) return res.status(400).send({res:"Already requested"});
        const mentor= await User.findOne({_id:mentorId});
        const friendRequest={
            studentId:studentId,
            mentorId:mentorId,
            studentName:req.user.name,
            mentorName:mentor.name,
        }
        const newFriendReq= new Friend(friendRequest);
        await newFriendReq.save();
        return res.status(201).send({res:"Friend request sent."});
    }
    catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});

// updating friend-request status
router.put("/request/:requestId",[authenticator],async (req,res)=>{
    try{
        const role=req.user.role;
        if(role=="student" && req.body.status=="accepted")
            return res.status(401).send({res:"Requestor cannot accept the request"});
        const query={_id:req.params.requestId};
        const friend = await Friend.findOne(query);
        if(!friend) return res.status(400).send({res:"Friend request doesn't exists."});
        //if(friend.status!=="cancelled")    --->>>>>>>>>>>>>>>>>  TO CHECK CONDITIONS
        friend.status=(req.body.status);

        const firstmessage={
            text:"****Mentor started chat****",
            sender:req.user._id,
            time:new Date()
        };
        if(friend.status=="accepted")
            friend.messages.push(firstmessage);
        await friend.save();
        res.status(200).send({res:"Status Updated."});
    }
    catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});


router.get("/chat",[authenticator],async (req,res)=>{
    const role=req.user.role;
    let query={};
    try{
        if(role=="student") query={ studentId:req.user._id ,status: "accepted"}
        else query={ mentorId:req.user._id ,status: "accepted"}
        let friends=await Friend.find(query);
        //console.log(friends);
        friends.sort(function(friendA, friendB){
            let lenA=friendA.messages.length;
            let lenB=friendB.messages.length;
            let dateA=friendA.messages[lenA-1].time;
            let dateB=friendB.messages[lenB-1].time;
            return new Date(dateB) - new Date(dateA);
          });
        //console.log(friends);
        return res.status(200).send({ res:friends });
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});


// sending new message/chat/text to a friend
router.post("/chat/:chatId",[authenticator],async (req,res)=>{
    const chatId=req.params.chatId;
    try{
        const chat=await Friend.findOne({_id:chatId});
        if(!chat) return res.status(400).send({res:"Friend request doesn't exists."});
        if(chat.status!=="accepted") return res.status(400).send({res:"Friend request not accepted."});
        const message={
            text:req.body.text,
            sender:req.user._id,
            time:new Date()
        };
        chat.messages.push(message);
        await chat.save();
        return res.status(200).send({res:chat});
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});

// get all chats of a friend
router.get("/chat/:chatId",[authenticator],async (req,res)=>{
    const chatId=req.params.chatId;
    try{
        const chat=await Friend.findOne({_id:chatId});
        if(!chat) return res.status(400).send({res:"Friend request doesn't exists."});
        if(chat.status!=="accepted") return res.status(400).send({res:"Friend request not accepted."});
        return res.status(200).send({res:chat});
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});

//get ChatId by mentorId
router.get("/getChatId/:mentorId",[sAuthenticator], async (req,res) =>{
    const mentorId=req.params.mentorId;
    const query={studentId:req.user._id, mentorId: mentorId, status: "accepted" };
    try{
        const chat= await (await Friend.findOne(query));
        //console.log(chat);
        if(!chat) return res.status(400).send({res:"Friend request not sent/accepted"});
        return res.status(200).send({res:chat._id});
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
})

// getting pending friend-requests
router.get("/request",[authenticator], async (req,res)=>{
    const role=req.user.role;
    let query={};
    try{
        if(role=="student") query={ $and:[{ studentId:req.user._id }, { status:{$ne:"accepted"}} ]};
        else query={$and:[{ mentorId:req.user._id }, { status:{$ne:"accepted"}} ]};
        const requests= await Friend.find(query)
        //console.log(requests);
        return res.status(200).send({res:requests});
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
});

router.get("/mentor",[sAuthenticator], async (req,res)=>{
    try{
        const mentors= await User.find({role:"mentor"});
        return res.status(200).send({res:mentors});
    }catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }
})


router.get("/", [authenticator], async ( req,res) =>{
    let filter={};
    if(req.user.role=='mentor')
        filter= { mentorId: req.user._id , status :'accepted' };
    else
        filter= { studentId: req.user._id , status :'accepted' };
    try{
        let friends = await Friend.find(filter).select('-messages');
        res.status(200).send({res:friends})
    }
    catch(ex){
        console.log(ex);
        return res.status(500).send({res:"Server Error occured"});
    }

});


module.exports=router;