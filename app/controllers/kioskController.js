const sequelize = require('../common/database');
const KioskService = require('../services/kioskService');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
    createKiosk: async(req, res) => {
        try {
            const kioskData = req.body;
            let kiosk;
            await sequelize.transaction(async (transaction) => {
                kiosk = await KioskService.createKiosk(kioskData, transaction)
            });
            return res.status(200).send(kiosk);
        } catch(err) {
            console.log(err);
            sendErrorResponse(res, err);
        }
    },

    updateKiosk: async(req, res) => {
        try {
            const kioskData = req.body;
            const { id } = req.params;
            let kiosk;
            await sequelize.transaction(async (transaction) => {
                kiosk = await KioskService.updateKiosk(id, kioskData, transaction);
            });
            return res.status(200).send(kiosk);
        } catch(err) {
            console.log(err)
            sendErrorResponse(res, err);
        } 
    },

    toggleDisableKiosk: async(req, res) => {
        try {
            const { id } = req.params;
            await sequelize.transaction(async (transaction) => {
                kiosk = await KioskService.toggleDisableKiosk(id, transaction);
            })
            return res.status(200).send(kiosk);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveKiosk: async(req, res) => {
        try {
            const { id } = req.params;
            let kiosk = await KioskService.retrieveKiosk(id);
            return res.status(200).send(kiosk);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveAllKiosks: async(req, res) => {
        try {
            let kiosks = await KioskService.retrieveAllKiosks();
            return res.status(200).send(kiosks);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },
    
    deleteKiosk: async(req, res) => {
        //to disallow deletion if there are associated lockers
        try {
            let { id } = req.params;
            await sequelize.transaction(async (transaction) => {
                await KioskService.deleteKiosk(id, transaction);
            });
            return res.status(200).send();
        } catch(err) {
            sendErrorResponse(res, err);
        }
    }
}
