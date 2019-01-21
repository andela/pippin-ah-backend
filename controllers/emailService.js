import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();


const Url = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api/v1/activate/' : process.env.HEROKU_URL;

const subject = 'Verification Email from LearnGround';
const from = 'noreply@learncode.academy';

export default {
  sendWelcomeMail(email, userId, next) {
    const activate = `${Url}${userId}`;
    sgMail.send({
      to: email,
      from,
      subject,
      html: `<h2 style=" text-align:justify";margin-left:30px;
      padding:15px">
      Welcome To LearnGround The Den of Great Ideas </h2><br>
       <strong>
       Your Registration was sucessfull </strong><br>
       <strong>
       Click <a href="${activate}">Activate</a> to activate your account
       </strong><br>
       <em>
       
       </em>`
    }, (error) => {
      if (error) {
        const emailError = new Error('could not send mail,email doesn"t exist');
        return next(emailError);
      }
    });
  }
};
