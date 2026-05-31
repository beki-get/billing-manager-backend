import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});


const mailOptions = {
  from: 'system@your-app.com',       
  to: 'test-user@anydomain.com',    
  subject: 'Invoice Processed Successfully 🚀',
  text: 'Hello, your automated invoice pipeline has successfully processed the document.',
  html: '<h1>Success!</h1><p>Your automated invoice pipeline has successfully processed the document.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email intercepted successfully by Mailtrap! ID:', info.messageId);
});