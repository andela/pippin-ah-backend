import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.EMAIL_API_KEY);


export default {
  sendWelcomeMail(email, from, subject, html) {
    sgMail.send({
      to: email,
      from,
      subject,
      html
    });
  }
};
