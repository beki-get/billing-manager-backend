//emailservice
console.log('emailService loaded');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async ({ to, subject, text }) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        return true;
    } catch (err) {
        console.error('Email send error:', err);
        return false;
    }
};

module.exports = { sendEmail };
