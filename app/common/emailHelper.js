
const nodemailer = require("nodemailer");

module.exports = {
  // async..await is not allowed in global scope, must use a wrapper
  sendEmail: async () => {
    try{
      console.log('(******)')
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: "1a2b3c4d5e6f7g",
          pass: "1a2b3c4d5e6f7g"
        }
  
      //  service:'gmail',
      //   auth: {
      //     user: 'szhan100@gmail.com', // generated ethereal user
      //     pass: 'Sz13914117700Sz90021283', // generated ethereal password
      //   },
      });
      console.log('(******)')

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"help@eazyzippy.com', // sender address
        to: "shizhan97@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.log(err)
    }
  } 

}

