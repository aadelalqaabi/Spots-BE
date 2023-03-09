const nodemailer = require("nodemailer");
const {
  DEST_E_U,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  DEST_E_P,
  GOOGLE_REFRESH_TOKEN,
} = require("../config/keys");
const hbs = require("nodemailer-express-handlebars");

const path = require("path");

exports.email = async (template, emailTo, emailSubject, emailText) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: DEST_E_U,
      pass: DEST_E_P,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
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
    from: `Dest <${DEST_E_P}>`,
    to: `${emailTo}`,
    subject: emailSubject,
    template: template,
    context: {
      OTP: emailText,
      name: emailText.name,
      amount: emailText.amount,
      details: emailText.details,
      date: emailText.startDate,
      time: emailText.startTime,
      image: emailText.image,
      user: emailText.user,
      id: emailText.id,
      email: emailText.email,
      phone: emailText.phone,
      password: emailText.password,
      displayNameEn: emailText.displayNameEn,
      fPasswords: emailText.password,
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
