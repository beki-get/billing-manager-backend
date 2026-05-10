const nodemailer = require('nodemailer');

//  using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,      // your email
        pass: process.env.EMAIL_PASS   // app password
    }
});

module.exports = transporter;
