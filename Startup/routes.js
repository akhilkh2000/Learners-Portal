const express=require("express");
const cors=require("cors");
const auth=require("../Routes/auth");
const profile=require("../Routes/profile");
const friend=require("../Routes/friend");
const payment=require("../Routes/feepayment");
const blog=require("../Routes/blog");

module.exports=function(app){
    app.use(cors());
    app.use(express.json());
    app.use("/api/auth",auth);
    app.use("/api/profile",profile);
    app.use("/api/friend",friend);
    app.use("/api/payment",payment);
    app.use("/api/blog",blog);
}

