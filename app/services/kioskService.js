const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Kiosk = require('../models/Kiosk')

  module.exports = { 
      createKiosk: async(kioskData, transaction) => {
          const { location, description } = kioskData;
          Checker.ifEmptyThrowError(location);
          const kiosk = await Kiosk.create(kioskData, { transaction });
          return kiosk;
      }, 

      updateKiosk: async(kioskData, transaction) => {

      },

      disableKiosk: async(id, transaction) => {
        const curKiosk = await Kiosk.findByPk(id);
        if(Checker.ifEmptyThrowError(curKiosk, Constants.Error.KioskNotFound));
        else {
            let kiosk = await Kiosk.update({
                enabled: !curKiosk.enabled
            }, {
                where: {
                    id: id
                }
            }, { returning: true, transaction });
            return kiosk;
        }
      },

      retrieveKiosk: async(id) => {

      },

      retrieveAllKiosk: async() => {

      },

      deleteKiosk: async(id) => {

      }
  }