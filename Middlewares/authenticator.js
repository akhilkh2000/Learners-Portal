const jwt = require("jsonwebtoken");
const config = require("../config");
const { User,validateUser } = require("../Models/User");

async function auth(req, res, next) {
  //console.log("Authenticating the Token.....");
  const token = req.header("x-auth-token");
  //console.log(req.header("x-auth-token"));
  if (!token) return res.status(401).send("Could not serve the request.");
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decoded;
    //console.log(decoded);
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token");
  }
}

module.exports = auth;