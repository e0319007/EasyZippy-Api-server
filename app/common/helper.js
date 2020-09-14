const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {

  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  },

  comparePassword: async (passwordInput, hashedPassword) => {
    return bcrypt.compare(passwordInput, hashedPassword);
  }
};