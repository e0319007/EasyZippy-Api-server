const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Kiosk = require('../models/Kiosk');
const { update } = require("lodash");

  module.exports = { 
      createKiosk: async(kioskData, transaction) => {
          const { location, description } = kioskData;
          Checker.ifEmptyThrowError(location, Constants.Error.KioskLocationRequired);
          let kiosk = await Kiosk.create(kioskData, { transaction });
          return kiosk;
      }, 

      updateKiosk: async(id, kioskData, transaction) => {
        Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
        let kiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);

        const updateKeys = Object.keys(kioskData);
        if(updateKeys.includes(location)) {
            Checker.ifEmptyThrowError(location, Constants.Error.KioskLocationRequired);
        }

        kiosk = await kiosk.update(kioskData, { returning: true, transaction})
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
        const kiosk = await Kiosk.findByPk(id);
        Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
        return kiosk;
      },

      retrieveAllKiosk: async() => {
        const kiosks = await Kiosk.findAll();
        return kiosks;
      },

      deleteKiosk: async(id) => {
        const kiosk = await Kiosk.findByPk(id);
        Kiosk.destroy({
            where: {
                id : id
            }
        });
      }
  }