const Cart = require('./app/models/Cart');
const Category = require('./app/models/Category');
const Customer = require('./app/models/Customer');
const Kiosk = require('./app/models/Kiosk');
const Merchant = require('./app/models/Merchant');
const Staff = require('./app/models/Staff');

const addDummyData = async () => {
  await Customer.create({ firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: 'Password123!', email: 'alice@email.com' });
  await Staff.create({ firstName: 'Ben', lastName: 'Ban', mobileNumber: '91234567', password: 'Password123!', email: 'ben@email.com' });
  await Merchant.create({ name: 'Nike', mobileNumber: '91234567', password: 'Password123!', email: 'nike@email.com' });
  await Category.create({ name: 'Fashion & Apparel', description: 'Sample Description' });
  await Kiosk.create({ lat: 1.3521, long: 103.8198, description: 'Located at the West Wing' });
};

addDummyData();