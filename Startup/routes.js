const express = require("express");
const cors = require("cors");
const auth = require("../Routes/auth");
const profile = require("../Routes/profile");
const friend = require("../Routes/friend");
const payment = require("../Routes/feepayment");
// const blog = require("../Routes/blog");

//All routes with their corresponding routers
module.exports = function (app) {
	app.use(cors()); //use is used to configure middlewares for the overall app
	app.use(express.json());
	app.use("/api/auth", auth);
	app.use("/api/profile", profile);
	app.use("/api/friend", friend);
	app.use("/api/payment", payment);
	// app.use("/api/blog", blog);
};
