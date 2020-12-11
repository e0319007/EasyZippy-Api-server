const paypal = require('paypal-rest-sdk');
const payouts = require('@paypal/payouts-sdk');
const sequelize = require('../common/database');
const config = require('config');
const { sendErrorResponse } = require('../common/error/errorHandler');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const ExternalPaymentRecordService = require('../services/externalPaymentRecordService');
const MerchantService = require('../services/merchantService');

const clientId = config.get('paypal_client_id');
const clientSecret = config.get('paypal_client_secret');
paypal.configure({
  'mode': 'live',
  'client_id': clientId,
  'client_secret': clientSecret
});
let environment = new payouts.core.LiveEnvironment(clientId, clientSecret);
let client = new payouts.core.PayPalHttpClient(environment);

module.exports = {
  pay: async (req, res) => {
    try {
      const { customerId, amount } = req.params;
      const payment = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": `http://localhost:5000/success?customerId=${customerId}&amount=${amount}`,
          "cancel_url": "http://localhost:5000/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "item name",
              "sku": "SKU001",
              "price": amount,
              "currency": "SGD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "SGD",
            "total": amount
          },
          "description": "This is a description"
        }]
      };
  
      paypal.payment.create(payment, (err, paymentCb) => {
        res.redirect(paymentCb.links[1].href);
      });
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  success: async (req, res) => {
    const customerId = req.query.customerId;
    const amount = req.query.amount;
    let payerId = req.query.PayerID;
    let paymentId = req.query.paymentId;
    var execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "SGD",
          "total": amount
        }
      }]
    };

    let paymentData;
      
    paypal.payment.execute(paymentId, execute_payment_json, (err, payment) => {
      if (err) {
        console.log(err.response);
        throw err;
      } else {
        paymentData = payment;
        res.render('success');
      }
    });

    setTimeout(async () => {await sequelize.transaction(async (transaction) => {
      await ExternalPaymentRecordService.createExternalPaymentRecord(customerId, paymentData, transaction);
    })}, 10000);
  },

  cancel: async (req, res) => {
    res.render('cancel');
  },

  merchantWithdraw: async (req, res) => {
    try {
      const { merchantId } = req.params;
      const { paypalEmail, amount } = req.body;

      //Check that merchant has sufficient balance
      const merchant = await MerchantService.retrieveMerchant(merchantId);
      Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
      if(merchant.creditBalance < Number(amount)) {
        throw new CustomError(Constants.Error.InsufficientCreditBalance);
      }

      let requestBody = {
        "sender_batch_header": {
          "sender_batch_id": `${Date.now()}`,
          "email_subject": "This is a test transaction from SDK",
          "email_message": "SDK payouts test txn",
          "note": "Payout note"
        },
        "items": [{
          "recipient_type": "EMAIL",
          "receiver": paypalEmail,
          "amount": {
            "currency": "SGD",
            "value": amount
          },
          "note": "This is your withdrawal",
          "sender_item_id": "Test_txn_1"
        }]
      };
      let request = new payouts.payouts.PayoutsPostRequest();
      request.requestBody(requestBody);
  
      let externalId;
      let createPayouts = async () => {
        let response = await client.execute(request);
        externalId = response.result.batch_header.payout_batch_id;
      };
      await createPayouts();

      let externalPaymentRecord;

      await sequelize.transaction(async (transaction) => {
        externalPaymentRecord = await ExternalPaymentRecordService.createExternalPaymentRecordMerchantWithdraw(merchantId, externalId, amount, transaction);
      });

      return res.status(200).send(externalPaymentRecord);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
};