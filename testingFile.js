const Cart = require('./app/models/Cart');
const Customer = require('./app/models/Customer');

const testMethod = async () => {
  let cart = await Cart.create();
  let customer = await Customer.create({ firstName: 'Customer', lastName: 'One', mobileNumber: '91234567', password: 'password', salt: 'salt', email: 'email' });

  await cart.setCustomer(customer);
};

testMethod();