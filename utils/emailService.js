const nodemailer = require('nodemailer');

// Example using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,      // your email
        pass: process.env.EMAIL_PASS   // app password if Gmail
    }
});

module.exports = transporter;