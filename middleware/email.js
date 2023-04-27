const nodemailer = require("nodemailer");
require('dotenv').config();
const hbs = require("nodemailer-express-handlebars");

const path = require("path");

exports.email = async (template, emailTo, emailSubject, emailText) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.DEST_E_U,
      pass: process.env.DEST_E_P,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  transporter.verify((err, success) => {
    err
      ? console.log(err)
      : console.log(`=== Server is ready to take messages: ${success} ===`);
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "views"),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, "views"),
      extName: ".handlebars",
    })
  );
  let mailOptions = {
    from: `Dest <${process.env.DEST_E_U}>`,
    to: `${emailTo}`,
    subject: emailSubject,
    template: template,
    context: {
      OTP: emailText,
      name: emailText.name,
      amount: emailText.amount,
      details: emailText.details,
      date: emailText.startDate,
      endDate: emailText.endDate,
      time: emailText.startTime,
      endTime: emailText.endTime,
      image: emailText.image,
      user: emailText.user,
      id: emailText.id,
      email: emailText.email,
      phone: emailText.phone,
      password: emailText.password,
      displayNameEn: emailText.displayNameEn,
      fPasswords: emailText.password,
      isFree: emailText.isFree,
    },
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
