const Checker = require("../common/checker");
const Constants = require('../common/constants');
const CustomError = require("../common/error/customError");

const Kiosk = require('../models/Kiosk');

  module.exports = { 
    createKiosk: async(kioskData, transaction) => {
        const { address } = kioskData;
        Checker.ifEmptyThrowError(address, Constants.Error.KioskAddressRequired);
        const kiosk = await Kiosk.create(kioskData, { transaction });
        return kiosk;
    }, 

    updateKiosk: async(id, kioskData, transaction) => {
      Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
      let kiosk = await Kiosk.findByPk(id);
      Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);

      if(kiosk.disabled) {
        throw new CustomError(Constants.Error.KioskDisabled);
      }

      const updateKeys = Object.keys(kioskData);
      if(updateKeys.includes('address') ) {
          Checker.ifEmptyThrowError(kioskData.address, Constants.Error.KioskAddressRequired);
      }

      kiosk = await kiosk.update(kioskData, { returning: true, transaction});

      return kiosk;
    },

    toggleDisableKiosk: async(id, transaction) => {
      // To disabled all associated lockers
      const curKiosk = await Kiosk.findByPk(id);
      Checker.ifEmptyThrowError(curKiosk, Constants.Error.KioskNotFound)
      console.log(curKiosk.disabled);
        let kiosk = await Kiosk.update({
          disabled: !curKiosk.disabled
        }, {
          where: {
            id
          }, returning: true, transaction });
      return kiosk;
    },

    retrieveKiosk: async(id) => {
      const kiosk = await Kiosk.findByPk(id);
      Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
      return kiosk;
    },

    retrieveAllKiosks: async() => {
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