const ISMSPH = require("isms-ph-api");
var otpGenerator = require('otp-generator');
 


module.exports = {
  sendOtp: (mobile, otp) => {
    var client = new ISMSPH({
      username: 'easyzippy',
      password: 'isms79801388'
      // This is optional
    , host: process.env.ISMS_HOST || "https://www.isms.com.my/"
    });

    mobile = '+65' + mobile;

    client.sendMessage({
      dstno: mobile,
      msg: 'Your verification code is ' + otp +  '. Thank you for registering for the Easy Zippy service.',
      sendid: 'EasyZippy',
      agreedterm: 'YES',
      type: 1
      }, (err, data) => {
       console.log(err || data);
    });
  },

  generateOtp: () => {
    return otpGenerator.generate(6, { alphabets: false, digits: true, upperCase: false, specialChars: false })
  }

}