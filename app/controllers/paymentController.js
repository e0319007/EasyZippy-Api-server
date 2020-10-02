const paypal = require('paypal-rest-sdk');
const sequelize = require('../common/database');

const ExternalPaymentRecordService = require('../services/externalPaymentRecordService');

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
      console.log(err)
      return res.status(400).send();
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
        console.log('entered else')
        paymentData = payment;
        console.log(paymentData)
        res.render('success');
      }
    });

    setTimeout(async () => {await sequelize.transaction(async (transaction) => {
      await ExternalPaymentRecordService.createExternalPaymentRecord(customerId, paymentData, transaction);
    })}, 10000);
  },

  cancel: async (req, res) => {
    res.render('cancel');
  }
};