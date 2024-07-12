import nodemailer from 'nodemailer';
import { SmtpUserName, SmtpUserPass } from '../secret.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: SmtpUserName,
    pass: SmtpUserPass,
  },
});

const sendEmailWithNodeMailer = async (emailData) => {
  // console.log('Email Data coming : ', emailData);
  try {
    const mailOptions = {
      from: SmtpUserName,
      to: emailData.email,
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.response);
  } catch (error) {
    console.log('Error occurred while sending email', error);
    throw error;
  }
};

export { sendEmailWithNodeMailer };
