const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

module.exports = {
  createPromotion: async(req, res) => {
    try {
      
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updatePromotion: async(req, res) => {
    try {
      
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}