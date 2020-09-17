
const nodemailer = require("nodemailer");
const crypto = require('crypto');

module.exports = {
  // async..await is not allowed in global scope, must use a wrapper
  sendEmail: async (email, token, host) => {
    try{
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({

       service:'gmail',
        auth: {
          user: 'easyzippyhelp@gmail.com', // generated ethereal user
          pass: 'Easyzippy123!', // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: 'easyzippyhelp@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Easy Zippy Reset Password", // Subject line
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + host + '/resetPassword/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },

  generateToken: async() => {
    let token;
    token = await crypto.randomBytes(50).toString('hex').slice(0,50);
    return token;
  }

}

