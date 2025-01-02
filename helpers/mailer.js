const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "fresher1test@gmail.com",
    pass: "avbvxrskpvdfxbbj",
  },
});

const sendMails = async (email, subject, text) => {
  const mailOptions = {
    from: '"SAAS RFP KARAN" <fresher1test@gmail.com>', 
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendMails };
