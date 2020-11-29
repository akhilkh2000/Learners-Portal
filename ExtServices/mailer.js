var nodemailer = require("nodemailer");
const config=require("../config");

async function initiateEmail(sendTo, URL) {
  //const URL = "https://parvalue.in/setNewPassword/" + token;
  const user = config.EMAIL_ID;
  const pass = config.EMAIL_PASS;
  //console.log(URL + ":" + user + ":" + pass + ":to:" + sendTo);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  var mailOptions = {
    from: "no-reply@learnersportalcom",
    to: sendTo,
    subject: "RESET PASSWORD",
    text: `Hi User,
      Please click the link to reset your password. The link will expire in 24 hours.\n
      ${URL} \n \n 
      **********DON'T SHARE THIS LINK**********`,
  };

  const res = await transporter.sendMail(mailOptions);
  console.log("Mail -->>\n"+res);
  return;
}
async function sendEmail(email, URL) {
  await initiateEmail(email, URL);
}
module.exports = sendEmail;




// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'youremail@gmail.com',
//     pass: 'yourpassword'
//   }
// });

// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });