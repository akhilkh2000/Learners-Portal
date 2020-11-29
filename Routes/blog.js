const express = require("express");
const router = express.Router();
const axios=require("axios");
const config=require("../config");
const bcrypt = require('bcrypt');
const {Blog}=require("../Models/Blog");
const authenticator=require("../Middlewares/authenticator");
const sAuthenticator=require("../Middlewares/sAuthenticator");
const mAuthenticator=require("../Middlewares/mAuthenticator");


router.get("/",[authenticator],async (req,res)=> {
    const blogs= await Blog.find();
    return res.status(200).send({res:blogs});
});

module.exports=router;