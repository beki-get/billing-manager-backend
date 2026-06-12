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
  subject: 'Invoice Processed Successfully',
  text: 'Hello, your automated invoice pipeline has successfully processed the document.',
  html: '<h1>Success!</h1><p>Your automated invoice pipeline has successfully processed the document.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email intercepted successfully by Mailtrap! ID:', info.messageId);
});


//the email for payment is recieved by client
//1,then when that client clicks the link it redirect to payment gateway(stripe)
//2,option 2 is when the client click the link it redirect to my invoice system to pay 
//but this is i think not common b/c the customer dont have direct relation to my system 
//3,,when client arrive in payment service it select the card and amount
//4,,then the payment gateway send webhook to my system to see if this client is registered and also have access
//5,,then the if it is succeed or failed the server send back the message to payment gateway 
//6,then the client recieve notification of success or failure