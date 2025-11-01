require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

(async () => {
  const success = await sendEmail({
    to: 'bereketgetayea@gmail.com',
    subject: 'Test Email',
    text: 'Hello from Billing Manager!'
  });

  console.log('Email sent:', success);
})();
