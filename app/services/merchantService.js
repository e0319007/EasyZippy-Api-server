const emailValidator = require('email-validator');

const Merchant = require('../models/Merchant');
const helper = require('../common/helper');

module.exports = {
  createMerchant: async (merchantData) => {
    const { name, mobileNumber, password, email } = merchantData;
    if (!emailValidator.validate(email)) {
      // throw error
    }
    merchantData.password = await helper.hashPassword(password);

    const merchant = await Merchant.create(merchantData);

    return merchant;
  }
};

function hashPassword(password) {
  const saltRounds = config.get('bcrypt.salt');

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}