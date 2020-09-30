const paypal = require('paypal-rest-sdk');
const sequelize = require('../common/database');

const ExternalPaymentRecordService = require('../services/externalPaymentRecordService');

module.exports = {
  pay: async (req, res) => {
    try {
      const { amount } = req.params;
      const payment = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": `http://localhost:5000/success?amount=${amount}`,
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

    // const paymentExecutionFunction = util.promisify(paypal.payment.execute);
    // await paymentExecutionFunction(paymentId, execute_payment_json)
    //   .then((err, payment) => {
    //     console.log('payment')
    //     console.log(payment)
    //   })
    //   .catch(err => console.log(err))
    // try {
    //   console.log('pre call')
    //   const x = await paymentExecutionFunction(paymentId, execute_payment_json);
    //   console.log('post call')
    //   console.log(x);
    //   console.log('post x')  
    // } catch (err) {
    //   console.log('error: ' +err)
    // }
      
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
      await ExternalPaymentRecordService.createExternalPaymentRecord(paymentData, transaction);
    })}, 10000);
  },

  cancel: async (req, res) => {
    res.redirect('cancel');
  }
};