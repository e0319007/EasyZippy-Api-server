const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const LocationService = require('../services/locationService');

module.exports = {
  createLocation: async(req, res) => {
    try{ 
      const locationData = req.body;
      let location;
      await sequelize.transaction(async (transaction) => {
        location = await LocationService.createLocation(locationData, transaction);
      });
      return res.status(200).send(location);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveLocationById: async(req, res) => {
    try{ 
      let { id } = req.params;
      return res.status(200).send(await LocationService.retrieveLocationById(id));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllLocations: async(req, res) => {
    try{ 
      return res.status(200).send(await LocationService.retrieveAllLocations());
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllLocationsWithoutDisabled: async(req, res) => {
    try{ 
      return res.status(200).send(await LocationService.retrieveAllLocationsWithoutDisabled());
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateLocation: async(req, res) => {
    try{ 
      const locationData = req.body;
      let { id } = req.params;
      let location;
      await sequelize.transaction(async (transaction) => {
        location = await LocationService.updateLocation(id, locationData, transaction);
      });
      return res.status(200).send(location);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  toggleDisableLocation: async(req, res) => {
    try{ 
      let { id } = req.params;
      let location;
      await sequelize.transaction(async (transaction) => {
        location = await LocationService.toggleDisableLocation(id, transaction);
      });
      return res.status(200).send(location);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteLocation: async(req, res) => {
    try{ 
      let { id } = req.params;
      let location;
      await sequelize.transaction(async (transaction) => {
        location = await LocationService.deleteLocation(id, transaction);
      });
      return res.status(200).send(location);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}