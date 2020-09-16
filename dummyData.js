const Category = require('./app/models/Category');
const Kiosk = require('./app/models/Kiosk');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');

const addDummyData = async () => {
  await StaffService.createStaff({ firstName: 'Ben', lastName: 'Ban', mobileNumber: '91234567', password: 'Password123!', email: 'ben@email.com' });
  await CustomerService.createCustomer({ firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: 'Password123!', email: 'alice@email.com' });
  await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '91234567', password: 'Password123!', email: 'nike@email.com' })
  await Category.create({ name: 'Fashion & Apparel', description: 'Sample Description' });
  await Kiosk.create({ lat: 1.3521, long: 103.8198, description: 'Located at the West Wing' });
};

addDummyData();