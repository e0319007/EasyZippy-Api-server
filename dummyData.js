const Category = require('./app/models/Category');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');
const AnnouncementService = require('./app/services/annoucementService');
const NotificationService = require('./app/services/notificationService');

const addDummyData = async () => {
  await StaffService.createStaff({ firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: 'Password123!', email: 'alice@email.com', staffRoleEnum: 'Admin' });
  await CustomerService.createCustomer({ firstName: 'Ben', lastName: 'Bek', mobileNumber: '92345678', password: 'Password123!', email: 'ben@email.com' });
  await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '93456789', password: 'Password123!', email: 'nike@email.com' });
  const staffId = (await StaffService.retrieveAllStaff())[0].id;
  const customerId = (await CustomerService.retrieveAllCustomers())[0].id;
  const merchantId = (await MerchantService.retrieveAllMerchants())[0].id;
  await CustomerService.activateCustomer(customerId);
  await MerchantService.approveMerchant(merchantId);
  await AnnouncementService.createAnnouncement({ title: 'The Ez2keep system will be disabled for maintenance on 21 September 2020', staffId });
  await NotificationService.createNotification({ title: 'Alice Ang made an order', merchantId });
  await Category.create({ name: 'Fashion & Apparel', description: 'Sample Description' });
};

addDummyData();