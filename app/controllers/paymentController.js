const paypal = require('paypal-rest-sdk');
const payouts = require('@paypal/payouts-sdk');
const sequelize = require('../common/database');
const config = require('config');

const ExternalPaymentRecordService = require('../services/externalPaymentRecordService');

const clientId = config.get('paypal_client_id');
const clientSecret = config.get('paypal_client_secret');
let environment = new payouts.core.SandboxEnvironment(clientId, clientSecret);
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
      console.log(err)
      return res.status(400).send();
    }
  },

  // merchantPay: async (req, res) => {
  //   try {
  //     const { merchantId, amount } = req.params;
  //     const payment = {
  //       "intent": "sale",
  //       "payer": {
  //         "payment_method": "paypal"
  //       },
  //       "redirect_urls": {
  //         "return_url": `http://localhost:5000/merchantPaySuccess?merchantId=${merchantId}&amount=${amount}`,
  //         "cancel_url": "http://localhost:5000/cancel"
  //       },
  //       "transactions": [{
  //         "item_list": {
  //           "items": [{
  //             "name": "item name",
  //             "sku": "SKU001",
  //             "price": amount,
  //             "currency": "SGD",
  //             "quantity": 1
  //           }]
  //         },
  //         "amount": {
  //           "currency": "SGD",
  //           "total": amount
  //         },
  //         "description": "This is a description"
  //       }]
  //     };
  
  //     paypal.payment.create(payment, (err, paymentCb) => {
  //       return res.send(paymentCb.links[1].href);
  //     });
  //   } catch (err) {
  //     console.log(err)
  //     return res.status(400).send();
  //   }
  // },

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

  // merchantPaySuccess: async (req, res) => {
  //   const merchantId = req.query.merchantId;
  //   const amount = req.query.amount;
  //   let payerId = req.query.PayerID;
  //   let paymentId = req.query.paymentId;
  //   var execute_payment_json = {
  //     "payer_id": payerId,
  //     "transactions": [{
  //       "amount": {
  //         "currency": "SGD",
  //         "total": amount
  //       }
  //     }]
  //   };

  //   let paymentData;

  //   paypal.payment.execute(paymentId, execute_payment_json, (err, payment) => {
  //     if (err) {
  //       console.log(err.response);
  //       throw err;
  //     } else {
  //       console.log('entered else')
  //       paymentData = payment;
  //       console.log(paymentData)
  //       res.render('success');
  //     }
  //   });

  //   setTimeout(async () => {await sequelize.transaction(async (transaction) => {
  //     await ExternalPaymentRecordService.createExternalPaymentRecordMerchantTopUp(merchantId, paymentData, transaction);
  //   })}, 10000);
  // },

  cancel: async (req, res) => {
    res.render('cancel');
  },

  merchantWithdraw: async (req, res) => {
    let requestBody = {
      "sender_batch_header": {
        "sender_batch_id": "Test_sdk_3",
        "email_subject": "This is a test transaction from SDK",
        "email_message": "SDK payouts test txn",
        "note": "Payout note"
      },
      "items": [{
        "recipient_type": "EMAIL",
        "receiver": "sb-bcjgy3288645@personal.example.com",
        "amount": {
          "currency": "SGD",
          "value": "1.00"
        },
        "note": "This is your withdrawal",
        "sender_item_id": "Test_txn_1"
      }]
    };
    let request = new payouts.payouts.PayoutsPostRequest();
    request.requestBody(requestBody);
 
    // Call API with your client and get a response for your call
    let createPayouts  = async () => {
      let response = await client.execute(request);
      console.log(`Response: ${JSON.stringify(response)}`);
      // If call returns body in response, you can get the deserialized version from the result attribute of the response.
      console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
    };
    createPayouts();
  }
};