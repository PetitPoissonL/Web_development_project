import { resolve } from 'path';
import { RegisterResponse } from '../../shared/enums/register-response.enum'
import { ContactUsMessageBody } from '../../shared/types/contact-us.type';

export function getEnvPath(dest: string): string {
  const env: string = process.env.NODE_ENV || 'development';
  return resolve(`${dest}/${env}.env`);
}

export function getDateFormat(date: Date): string {
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}
// Exemple de helper

export function sendemail(email: string, status: RegisterResponse | string, body?: ContactUsMessageBody): void {

  const nodemailer = require('nodemailer');
  let contactValide = false
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'lbblk1998@gmail.com',
      pass: 'ypariofyuxjjgdjo',
    },
  });
  let Emailsubject: string;
  if (status == RegisterResponse.USER_ALREADY_EXISTS) {
    Emailsubject = 'Your account SNWLC INSURANCE has already existed'
  }
  else if (status == 'SUCCESS'){
    console.log('contact us success!')

    Emailsubject = 'We have received your message!'
    contactValide = true
  }
  else {
    Emailsubject = 'Your account SNWLC INSURANCE has been created successfully'
  }
  let mailOptions={}
  if (contactValide ==true) {
    //contact us
    // console.log('contact us message!')
    // console.log('senderEmail : ', body.email)
    mailOptions = {
      from: '"SNWLC INSURANCE" <lbblk1998@gmail.com>', // sender
      to:body.email, // receivers
      subject: Emailsubject, //   Subject line

      html: '<p class="fs-5">We have received your message : </p>' + body.message + 
      '<p class="fs-3">Feel free to contact us if you have any problem.</p><p>Team SNWLC </p>'

    };
  }else {
    //register
    mailOptions = {
      from: '"SNWLC INSURANCE" <lbblk1998@gmail.com>', // sender
      to: email, // receivers
      subject: Emailsubject, // Subject line
      // send html body
      // text: 'Hello world?', // plain text body
      html: '<b>Please log in to this URL</b> http://13.36.135.25/front' 
      // html body
    };
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

}