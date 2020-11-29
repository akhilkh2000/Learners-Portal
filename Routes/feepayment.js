const express = require("express");
const router = express.Router();
const { Friend, validateFriend } = require("../Models/Friend");
const authenticator = require("../Middlewares/authenticator");
const { User } = require("../Models/User");
const Razorpay = require("razorpay");
const config = require("../config");
const { FeePayment } = require("../Models/FeePayment");

router.post("/createOrder", [authenticator], async (req, res) => {
	const role = req.user.role;
	if (role == "student")
		return res.status(401).send({ res: "Request forbidden" });

	const razorpay = new Razorpay({
		key_id: config.RZ_CLIENT_ID,
		key_secret: config.RZ_KEY_SECRET,
	});
	try {
		let newTrx = new FeePayment(await createOrd(req.body, req.user));
		//console.log(newTrx);
		var orderDetails = {
			amount: newTrx.amount * 100,
			currency: newTrx.currency,
			receipt: "" + newTrx._id,
			payment_capture: true,
			notes: {
				items: newTrx.items,
			},
		};
		//console.log(orderDetails);

		razorpay.orders.create(orderDetails, async function (err, order) {
			if (err) {
				console.log(err);
				return res.status(400).send({ result: err });
			}
			//console.log("Trx in Rz")
			newTrx.createdAt = order.created_at;
			newTrx.orderId = order.id;
			newTrx.status = order.status;
			try {
				await newTrx.save();
				return res.status(201).send({
					result: {
						orderId: order.id,
						trxId: newTrx._id,
					},
				});
			} catch (ex) {
				console.log(ex);
				return res.status(500).send({ result: "Server error occured--" });
			}
		});
	} catch (ex) {
		return res.status(500).send({ result: "Server error occured" });
	}
});

router.post("/acceptPayment", async (req, res) => {
	let paymentDetails = getPaymentDetail(req.body);
	console.log(paymentDetails);
	try {
		let trx = await FeePayment.findById(paymentDetails.trxId);
		trx.paymentId = paymentDetails.paymentId;
		trx.status = "paid";
		if (paymentDetails.rz_signature) trx.signature = paymentDetails.signature;
		await trx.save();
		return res.status(202).send({ result: "Payment Accepted" });
	} catch (ex) {
		return res.status(500).send({ result: "Server error occured" });
	}
});

function getPaymentDetail(paymentDetail) {
	return paymentDetail;
}

async function createOrd(body, user) {
	//console.log(body)
	let ordObj = {
		requesterId: user._id,
		requesterName: user.name,
		requestedToId: body.requestedTo.studentId,
		requestedToName: body.requestedTo.studentName,
		amount: Number(body.amount),
		currency: "INR",
		items: body.title,
	};
	return ordObj;
}

router.get("/paymentRequests", [authenticator], async (req, res) => {
	let filter = {};
	if (req.user.role == "student") filter = { requestedToId: req.user._id };
	else filter = { requesterId: req.user._id };
	filter.status = "CREATED";
	try {
		const payments = await FeePayment.find(filter);
		return res.status(200).send({ res: payments });
	} catch (ex) {
		return res.status(500).send({ result: "Server error occured" });
	}
});

router.get("/transactions", [authenticator], async (req, res) => {
	const role = req.user.role;
	let filter = { status: "PAID" };
	if (role == "student") filter.requestedToId = req.user._id;
	else filter.requesterId = req.user._id;
	try {
		let trxs = await FeePayment.find(filter);
		let tot = 0;
		trxs.forEach((trx) => {
			tot = tot + trx.amount;
		});
		let type = role == "student" ? "Spent" : "Earning";
		trxs.tot = tot;
		trxs.type = type;
		return res
			.status(200)
			.send({ res: trxs, extras: { tot: tot, type: type } });
	} catch (ex) {
		return res.status(500).send({ result: "Server error occured" });
	}
});

module.exports = router;
