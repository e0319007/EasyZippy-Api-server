const sequelize = require('../common/database');
const KioskService = require('../services/kioskService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const kioskService = require('../services/kioskService');

module.exports = {
    createKiosk: async(req, res) => {
        try {
            const kioskReq = req.body;
            let kiosk;
            await sequelize.transaction(async (transaction) => {
                kiosk = await KioskService.createKiosk(kioskData, transaction)
            });
            return res.status(200).send(kiosk);
        } catch(err) {
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
            sendErrorResponse(res, err);
        } 
    },

    disableKiosk: async(req, res) => {
        try {
            const { id } = req.params;
            await sequelize.transaction(async (transaction) => {
                kiosk = await KioskService.disableKiosk(id, transaction);
            })
            return res.status(200).send(kiosk);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveKiosk: async(req, res) => {
        try {
            const { id } = req.params;
            let kiosk = await kioskService.retrieveKiosk(id);
            return res.status(200).send(kiosk);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },

    retrieveAllKiosk: async(req, res) => {
        try {
            let kiosks = await kioskService.retrieveAllKiosk();
            return res.status(200).send(kiosks);
        } catch(err) {
            sendErrorResponse(res, err);
        }
    },
    
    deleteKiosk: async(req, res) => {
        try {
            let id = req.params;
            kioskService.disableKiosk(id);
            return res.status(200).send();
        } catch(err) {
            sendErrorResponse(res, err);
        }
    }
}