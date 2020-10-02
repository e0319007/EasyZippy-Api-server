const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const BookingPackageModelService = require('../services/bookingPackageModelService');

module.exports = {
  createBookingPackageModel: async(req, res) => {
    try {
      const bookingPackageModelData = req.body;
      let bookingPackageModel;
      await sequelize.transaction(async (transaction) => {
        bookingPackageModel = await BookingPackageModelService.createBookingPackageModel(bookingPackageModelData, transaction)
      });
      return res.status(200).send(bookingPackageModel);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateBookingPackageModel: async(req, res) => {
    try {
      const { id } = req.params;
      const bookingPackageModelData = req.body;
      let bookingPackageModel;
      await sequelize.transaction(async (transaction) => {
        bookingPackageModel = await BookingPackageModelService.updateBookingPackageModel(id, bookingPackageModelData, transaction)
      });
      return res.status(200).send(bookingPackageModel);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  toggleDisableBookingPackageModel: async(req, res) => {
    try {
      const { id } = req.params;
      let bookingPackageModel;
      await sequelize.transaction(async (transaction) => {
        bookingPackageModel = await BookingPackageModelService.toggleDisableBookingPackageModel(id, transaction)
      });
      return res.status(200).send(bookingPackageModel);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  viewAllBookingPackageModel: async(req, res) => {
    try {
      return res.status(200).send(await BookingPackageModelService.viewAllBookingPackageModel());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  viewBookingPackageModel: async(req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).send(await BookingPackageModelService.viewBookingPackageModel(id));
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteBookingPackageModel: async(req, res) => {
    try {
      const { id } = req.params;
      await BookingPackageModelService.deleteBookingPackageModel(id);
      return res.status(200).send();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}
