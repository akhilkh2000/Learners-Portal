const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("../config");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../Models/User");
const authenticator = require("../Middlewares/authenticator");
const sAuthenticator = require("../Middlewares/sAuthenticator");
const mAuthenticator = require("../Middlewares/mAuthenticator");
const { Profile } = require("../Models/Profile");
const { Friend } = require("../Models/Friend");

//Private Mentors Profile
router.get("/", [authenticator], async (req, res) => {
	const userId = req.user._id;
	let extras = {};
	try {
		const profile = await Profile.findOne({ userId: userId });
		let connFilter = { mentorId: userId };
		let connection = await Friend.findOne(connFilter);
		if (connection) extras.isConnected = true;
		else extras.isConnected = false;
		extras.connections = await Friend.find({ mentorId: userId }).select(
			"studentName"
		);
		return res.status(200).send({ res: { profile: profile, extras: extras } });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

router.put("/", [authenticator], async (req, res) => {
	const userId = req.user._id;
	if (userId !== req.body.userId)
		return res.status(401).send({ res: "Forbidden" });
	try {
		var data = req.body;
		var profile = await Profile.findOne({ userId: userId });
		profile.info = data.info;
		profile.social = data.social;
		profile.designation = data.designation;
		profile.skills = data.skills;
		await profile.save();
		return res.status(200).send({ res: { profile: profile } });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

//get recommended profiles
router.get("/recommended", [sAuthenticator], async (req, res) => {
	const studentId = req.user._id;
	try {
		const sProfile = await Profile.findOne({ userId: studentId });
		const favourites = sProfile.topSearches;
		let topMentors = await getTopMentors(5);
		if (favourites.length == 0)
			return res.status(200).send({ res: topMentors });
		let recommendedMentors = await getRecommended(favourites);
		let mergedProfiles = recommendedMentors.concat(topMentors);
		let recommendedProfiles = [];
		let idSet = new Set();
		for (var i = 0; i < mergedProfiles.length; i++) {
			let cur = mergedProfiles[i];
			let id = cur.userId;
			if (!idSet.has(id)) {
				idSet.add(id);
				recommendedProfiles.push(cur);
			}
		}
		return res.status(200).send({ res: recommendedProfiles });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

//get recommended profiles
router.get("/allmentors", [sAuthenticator], async (req, res) => {
	try {
		const allMentors = await Profile.find({ role: "mentor" });
		return res.status(200).send({ res: allMentors });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

// get profile of mentor by userId
router.get("/public/:userId", [authenticator], async (req, res) => {
	const userId = req.params.userId;
	const authId = req.user._id;
	let extras = {};
	try {
		let profile = await Profile.findOne({ userId: req.params.userId });
		/* Saving Recommended Features */
		let authProfile = await Profile.findOne({ userId: authId });
		authProfile.topSearches = Array.from(
			new Set(authProfile.topSearches.concat(profile.skills))
		);
		await authProfile.save();
		/* Saving Recommended Features */
		extras.isRated = profile.ratings.some(
			(rating) => rating.userId === req.user._id
		);
		let connFilter = {
			studentId: req.user._id,
			mentorId: userId,
			status: "accepted",
		};
		let connection = await Friend.findOne(connFilter);
		if (connection) extras.isConnected = true;
		else extras.isConnected = false;
		extras.connections = await Friend.find({
			mentorId: userId,
			status: "accepted",
		}).select("studentName");
		return res.status(200).send({ res: { profile: profile, extras: extras } });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

router.get("/mentor", [sAuthenticator], async (req, res) => {
	try {
		const mentors = await User.find({ role: "mentor" });
		return res.status(200).send({ res: mentors });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

router.get("/mentor/:mentorId", [sAuthenticator], async (req, res) => {
	try {
		const mentorId = req.params.mentorId;
		const mentor = await User.find({ role: "mentor", _id: mentorId });
		return res.status(200).send({ res: mentor });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

/*
{
    rating:4.5,
    comment:''
}

*/
router.post("/rate/:mentorId", [sAuthenticator], async (req, res) => {
	const mentorId = req.params.mentorId;
	const studentId = req.user._id;
	try {
		let mentor = await Profile.findOne({ userId: mentorId });
		console.log(mentor);
		if (mentor && mentor.ratings && mentor.ratings.length > 0) {
			const isRated = mentor.ratings.some(
				(rating) => rating.userId === studentId
			);
			if (isRated) return res.status(400).send({ res: "Already Rated" });
		}
		const newRating = {
			userId: studentId,
			rating: req.body.rating,
			comment: req.body.comment,
			reviewer: req.user.name,
		};
		mentor.ratings.push(newRating);
		mentor.avgRating = mentor.getAvgRating();
		await mentor.save();
		return res.status(200).send({ res: mentor });
	} catch (ex) {
		console.log(ex);
		return res.status(500).send({ res: "Server Error occured" });
	}
});

/* Skill Upates starts */
router.post("/skills", [authenticator], async (req, res) => {
	const userId = req.user._id;
	const skill = req.body.skill.toLowerCase();
	var profile = await Profile.findOne({ userId: userId });
	if (profile.skills.includes(skill)) {
		return res.status(400).send({ res: "Skill already added" });
	}
	profile.skills.push(skill);
	await profile.save();
	return res.status(200).send({ res: profile });
});

router.delete("/skills", [authenticator], async (req, res) => {
	const userId = req.user._id;
	const skill = req.body.skill.toLowerCase();
	var profile = await Profile.findOne({ userId: userId });
	if (profile.skills.includes(skill)) {
		const index = profile.skills.indexOf(skill);
		profile.skills = profile.skills.splice(index, 1);
		await profile.save();
		return res.status(200).send({ res: profile });
	}
	return res.status(400).send({ res: profile });
});
/* Skill Upates ends */
/* Social Updates starts */

router.put("/social", [authenticator], async (req, res) => {
	const userId = req.user._id;
	const social = req.body;
	var profile = await Profile.findOne({ userId: userId });
	profile.social = social;
	await profile.save();
	return res.status(200).send({ res: profile });
});
/* Social Updates ends */

/* Info Updates starts */

router.put("/userinfo", [authenticator], async (req, res) => {
	const userId = req.user._id;
	const info = req.body;
	var profile = await Profile.findOne({ userId: userId });
	profile.info = info;
	await profile.save();
	return res.status(200).send({ res: profile });
});
/* Info Updates ends */

/* Helper functions Starts */

async function getTopMentors(N) {
	let topN = await Profile.find({ role: "mentor" }).sort("-avgRating").limit(N);
	return topN;
}

async function getRecommended(favArray) {
	//queries for all mentors matching skills found in top clicked
	let query = {
		$and: [
			{ role: "mentor" },
			{
				$or: [
					{ skills: { $in: favArray } },
					{ certificates: { $in: favArray } },
				],
			},
		],
	};
	let recommended = await Profile.find(query).sort("-avgRating");
	return recommended;
}

/* Helper functions Ends */

module.exports = router;
