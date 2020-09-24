const paypal = require('paypal-rest-sdk');

module.exports = {
  pay: async (req, res) => {
    try {
      const { amount } = req.body;
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
      
    paypal.payment.execute(paymentId, execute_payment_json, function (err, payment) {
      if (err) {
        console.log(err.response);
        throw err;
      } else {
        res.render('success');
      }
    });
  },

  cancel: async (req, res) => {
    res.redirect('cancel');
  }
};