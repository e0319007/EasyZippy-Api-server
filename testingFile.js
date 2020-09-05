const Cart = require('./app/models/Cart');
const Customer = require('./app/models/Customer');

const testMethod = async () => {
  
  let customer = await Customer.create({ firstName: 'Customer', lastName: 'One', mobileNumber: '91234567', password: 'password', salt: 'salt', email: 'email' });
  let cart = await Cart.create({customerId: customer.id});
//  await cart.setCustomer(customer);
 // await customer.setCart(cart);
  //await customer.save();
  //await cart.save();
  console.log(" customer: " + (await cart.getCustomer()).firstName);
  console.log("cart : " + (await customer.getCart()).id);
};

testMethod();