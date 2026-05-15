import 'dotenv/config';
import emailService from './utils/emailService.js';

(async () => {
  const success = await emailService.sendMail({
    to: 'bereketgetayea@gmail.com',
    subject: 'Test Email',
    text: 'Hello from Billing Manager!'
  });

  console.log('Email sent:', success);
})();
