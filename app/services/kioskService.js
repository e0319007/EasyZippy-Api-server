const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Kiosk = require('../models/Kiosk');
const Mall = require('../models/Mall');

module.exports = { 
  createKiosk: async(kioskData, transaction) => {
      const { address, mallId } = kioskData;
      Checker.ifEmptyThrowError(address, Constants.Error.KioskAddressRequired);
      Checker.ifEmptyThrowError(mallId, 'Mall ID ' + Constants.Error.XXXIsRequired);
      Checker.ifEmptyThrowError(await Mall.findByPk(mallId), Constants.Error.MallNotFound);
      Checker.ifDeletedThrowError(await Mall.findByPk(mallId), Constants.Error.MallDeleted); 
      const kiosk = await Kiosk.create(kioskData, { transaction });
      return kiosk;
  }, 

  updateKiosk: async(id, kioskData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let kiosk = await Kiosk.findByPk(id);
    Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
    Checker.ifDeletedThrowError(kiosk, Constants.Error.KioskDeleted);

    const updateKeys = Object.keys(kioskData);
    if(updateKeys.includes('address')) {
        Checker.ifEmptyThrowError(kioskData.address, Constants.Error.KioskAddressRequired);
    }

    kiosk = await kiosk.update(kioskData, { returning: true, transaction});

    return kiosk;
  },

  toggleDisableKiosk: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    // To disabled all associated lockers
    const curKiosk = await Kiosk.findByPk(id);
    Checker.ifEmptyThrowError(curKiosk, Constants.Error.KioskNotFound);
    Checker.ifDeletedThrowError(curKiosk, Constants.Error.KioskDeleted);

    let kiosk = await Kiosk.update({
      disabled: !curKiosk.disabled
    }, {
      where: {
        id
      }, returning: true, transaction });
    return kiosk;
  },

  retrieveKiosk: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const kiosk = await Kiosk.findByPk(id);
    Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
    Checker.ifDeletedThrowError(kiosk, Constants.Error.KioskDeleted);

    return kiosk;
  },

  retrieveAllKiosks: async() => {
    const kiosks = await Kiosk.findAll({where: { deleted: false } });
    return kiosks;
  },

  deleteKiosk: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const kiosk = await Kiosk.findByPk(id);
    Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
    //do a check on the list of lockers
    await Kiosk.update({
      deleted: true
    },{
      where: {
        id
      }, transaction
    });
  }
}