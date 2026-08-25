import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config();

//using Resend for sending emails, not nodemailer
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html})=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Lost And Found Application <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
          });

          if (error) {
            return console.error({ error });
          }

          return data;

    } catch (error) {
        console.log("In SendEmail.js File Error" +  error);
    }
}

export default sendEmail;