const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  hashPassword: async (password) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.log(`Error: ${err}`);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(`Error: ${err}`);
        }
        return hash;
      });
    });
  },
};