const ISMSPH = require("isms-ph-api");
var otpGenerator = require('otp-generator');
 
var client = new ISMSPH({
    username: 'easyzippy',
    password: 'isms79801388'
    // This is optional
  , host: "https://www.isms.com.my/"
});
module.exports = {
  sendOtp: (mobile, otp) => {
    client.sendMessage({
      dstno: mobile,
      msg: 'Your verification code is ' + otp +  '. Thank you for registering for the Ez2Keep service.',
      sendid: 'MyId',
      agreedterm: 'YES',
      type: 1
      }, (err, data) => {
      console.log(err || data);
    });
  },

  generateOtp: () => {
     return otpGenerator.generate(6, { upperCase: false, specialChars: false });
  }

}