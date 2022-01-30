const mailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = mailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.SENDGRID_API_KEY,
        },
      })
    );

    await transporter.sendMail({
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      to: email,
      subject: subject,
      html: text,
    });
  } catch (err) {
    console.log(err);
  }
};
