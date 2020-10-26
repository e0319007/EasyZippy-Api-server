const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const MallService = require('../services/mallService');

module.exports = {
  createMall: async(req, res) => {
    try{ 
      const mallData = req.body;
      let mall;
      await sequelize.transaction(async (transaction) => {
        mall = await MallService.createMall(mallData, transaction);
      });
      return res.status(200).send(mall);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMallById: async(req, res) => {
    try{ 
      let { id } = req.params;
      return res.status(200).send(await MallService.retrieveMallById(id));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMalls: async(req, res) => {
    try{ 
      return res.status(200).send(await MallService.retrieveAllMalls());
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMallsWithoutDisabled: async(req, res) => {
    try{ 
      return res.status(200).send(await MallService.retrieveAllMallsWithoutDisabled());
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateMall: async(req, res) => {
    try{ 
      const mallData = req.body;
      let { id } = req.params;
      let mall;
      await sequelize.transaction(async (transaction) => {
        mall = await MallService.updateMall(id, mallData, transaction);
      });
      return res.status(200).send(mall);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  toggleDisableMall: async(req, res) => {
    try{ 
      let { id } = req.params;
      let mall;
      await sequelize.transaction(async (transaction) => {
        mall = await MallService.toggleDisableMall(id, transaction);
      });
      return res.status(200).send(mall);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteMall: async(req, res) => {
    try{ 
      let { id } = req.params;
      let mall;
      await sequelize.transaction(async (transaction) => {
        mall = await MallService.deleteMall(id, transaction);
      });
      return res.status(200).send(mall);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}