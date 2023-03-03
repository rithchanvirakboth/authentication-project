const nodemailer = require('nodemailer');

const sendEmail = (email, url, txt) => {
    
  let config = {
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.PASSWORD
    }
  }

  let transporter = nodemailer.createTransport(config);

  let message = {
    from: process.env.SENDER_EMAIL,
        to: email,
        subject: "PLEASE VERIFY YOUR EMAIL ADDRESS",
        html: `
        <div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Please click button below to activate your email.</h2>
          <a href="${url}" style="background: teal; text-decoration: none; color: white; padding: 7px 10px; border-radius: 5px; font-size: 110%;">${txt}</a>
          <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          <div>${url}</div>
        </div>
        `
  };

  transporter.sendMail(message).then(() => {
    console.log('Email sent successfully');
    console.log(message);
  }).catch((err) => {
    console.log(err);
  })
  


}

module.exports = sendEmail;