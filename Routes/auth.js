const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const mail = require("../ExtServices/mailer");
const { User, validateUser } = require("../Models/User");
const { Profile } = require("../Models/Profile");
const saltRounds = 10;

router.get("/isLive", async (req, res) => {
	res.status(200).send({ result: "Accepting Payment: Yes" });
});

router.post("/register", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.status(400).send({ res: "Email already registered" });
		}
		req.body.password = await getHash(req.body.password);
		const newUser = new User(req.body);
		const profile = new Profile({
			userId: newUser._id,
			role: newUser.role,
			name: newUser.name,
		});
		profile.info = await getInfoObj(newUser.name, req.body.email);
		profile.social = await getSocialObj();
		profile.gender = req.body.gender;
		profile.designation = req.body.role;
		if (req.body.role === "student") profile.regCode = req.body.regCode;
		await newUser.save();
		await profile.save();
		return res.status(201).send({ res: "User Created" });
	} catch (ex) {
		console.log(ex);
		return res.status(501).send({ res: "Server error occured." });
	}
});
/* Password Reset implementation begins */
router.post("/resetPassword", async (req, res) => {
	const resetToken = req.body.token;
	const password = req.body.password;
	const userId = await getUserId(resetToken);
	if (!userId) return res.status(400).send({ res: "Link invalid/expired" });
	try {
		const user = await User.findOne({ _id: userId });
		user.password = await getHash(password);
		await user.save();
		return res.status(200).send({ res: "Password Changed" });
	} catch (ex) {
		console.log(ex);
		return res.status(501).send({ res: "Server error occured." });
	}
});

async function getUserId(resetToken) {
	try {
		const decoded = jwt.verify(resetToken, config.JWT_SECRET_KEY);
		return decoded._id;
	} catch (ex) {
		console.log(ex);
		return null;
	}
}

router.post("/sendPasswordResetLink", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(400).send({ res: "Invalid email/password" });
		const resetToken = user.generateAuthToken();
		let link = req.get("origin") + "/setNewPassword/" + resetToken;
		await mail(req.body.email, link);
		return res.status(200).send({ res: "Link sent." });
	} catch (ex) {
		console.log(ex);
		return res.status(501).send({ res: "Server error occured." });
	}
});

/* Password Reset implementation begins */

async function getHash(password) {
	//more the salt rounds , higher the cost factor, more hashing rounds are done to increase unqiueness
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).send({ res: "Invalid email/password" });
		}
		const isPasswordCorrect = bcrypt.compareSync(
			req.body.password,
			user.password
		);
		if (isPasswordCorrect) {
			return res.status(200).send({ res: user.generateAuthToken() });
		} else {
			return res.status(400).send({ res: "Invalid email/password" });
		}
	} catch (ex) {
		console.log(ex);
		return res.status(501).send({ res: "Server error occured." });
	}
});

/* Helper Functions starts  */

async function getInfoObj(name, email) {
	const infoArr = [
		{ title: "name", value: name },
		{ title: "email", value: email },
		{ title: "phone", value: "NA" },
		{ title: "country", value: "NA" },
	];
	return infoArr;
}

async function getSocialObj() {
	const socialArr = [
		{ platform: "website", link: "NA" },
		{ platform: "linkedIn", link: "NA" },
		{ platform: "github", link: "NA" },
		{ platform: "facebook", link: "NA" },
	];
	return socialArr;
}

/* Helper functions Ends */

module.exports = router;
