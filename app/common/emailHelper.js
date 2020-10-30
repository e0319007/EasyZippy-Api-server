const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = {
  // async..await is not allowed in global scope, must use a wrapper
  sendEmail: async (email, token) => {
    try{
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
        subject: 'Easy Zippy Password Reset', // Subject line
        text: 'You are receiving this because you requested the reset of the password for your account.\n\n' +
        'Please enter this code:\n\n' +
         token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n' 
        + ' \n <This is a system generated email, Please do not reply>'
      });

      //console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },

  generateToken: async() => {
    let token;
    token = await crypto.randomBytes(25).toString('hex').slice(0,50);
    return token;
  },

  sendEmailForMerchantApproval: async(email) => {
    try{
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
        subject: 'Ez2Keep Account Approved', // Subject line
        text: 'Dear user,\n \n' + 'You are receiving this because your merchant account has been approved. \n \n' + 
        'You can start posting new products!\n' + ' \n <This is a system generated email, Please do not reply>'
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },

  sendEmailForMerchantDisapproval: async(email) => {
    try{
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
        subject: 'Your Ez2Keep account has been banned', // Subject line
        text: 'Dear user,\n \n' + 'You are receiving this because your merchant account has been banned.\n \n' + 
        'Please contact Ez2Keep admin if you have any queries.\n' + ' \n <This is a system generated email, Please do not reply>'
      });

      //console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },

  sendEmailForNewStaffAccount: async(email, password) => {
    try{
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
        subject: 'Your account is ready for use', // Subject line
        text: `Dear staff,\n\nYour new account is ready for use.\n\nYou have been assigned a temporary password: ${password}\n\nPlease log in and change your password.\n\n<This is a system generated email, Please do not reply>`
      });

      //console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },


  sendEmailForAddCollector: async(email, bookingId) => {
    try{
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
        subject: 'Your are added as a collector', // Subject line
        text: `Dear customer,\n\nYou are added as a collector for booking ` + bookingId + `.\n\n Please log in to view booking.\n\n<This is a system generated email, Please do not reply>`
      });

      //console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },

  sendEmailForRemoveCollector: async(email, bookingId) => {
    try{
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
        subject: 'Your are added as a collector', // Subject line
        text: `Dear customer,\n\nYou are removed as a collector for booking ` + bookingId + `.\n\n<This is a system generated email, Please do not reply>`
      });

      //console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview only available when sending through an Ethereal account
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  },
}

