const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Kiosk = require('../models/Kiosk');
const { update } = require("lodash");

  module.exports = { 
      createKiosk: async(kioskData, transaction) => {
          const { lat, long , description } = kioskData;
          Checker.ifEmptyThrowError(lat, Constants.Error.KioskLocationRequired);
          Checker.ifEmptyThrowError(long, Constants.Error.KioskLocationRequired);
          let kiosk = await Kiosk.create(kioskData, { transaction });
          return kiosk;
      }, 

      updateKiosk: async(id, kioskData, transaction) => {
        Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
        let kiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);

        const updateKeys = Object.keys(kioskData);
        if(updateKeys.includes('lat') ) {
            Checker.ifEmptyThrowError(kioskData.lat, Constants.Error.KioskLocationRequired);
        }
        if(updateKeys.includes('long')) {
          Checker.ifEmptyThrowError(kioskData.long, Constants.Error.KioskLocationRequired);
        }
        return kiosk = await kiosk.update(kioskData, { returning: true, transaction})
      },

      disableKiosk: async(id, transaction) => {
        const curKiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(curKiosk, Constants.Error.KioskNotFound)
        console.log(curKiosk.enabled);
          let kiosk = await Kiosk.update({
              enabled: !curKiosk.enabled
          }, {
              where: {
                  id: id
              }, returning: true, transaction });
          return kiosk;
      },

      retrieveKiosk: async(id) => {
        const kiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
        return kiosk;
      },

      retrieveAllKiosk: async() => {
        const kiosks = await Kiosk.findAll();
        return kiosks;
      },

      deleteKiosk: async(id) => {
        console.log(id);
        const kiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
        Kiosk.destroy({
            where: {
                id
            }
        });
      }
      
  }