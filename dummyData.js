const Category = require('./app/models/Category');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');
const AnnouncementService = require('./app/services/announcementService');
const NotificationService = require('./app/services/notificationService');
const Locker = require('./app/models/Locker');
const Kiosk = require('./app/models/Kiosk');
const LockerType = require('./app/models/LockerType');
const Advertisement = require('./app/models/Advertisement');

const addDummyData = async () => {
  await StaffService.createStaff({ firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: 'Password123!', email: 'alice@email.com', staffRoleEnum: 'Admin' });
  await CustomerService.createCustomer({ firstName: 'Ben', lastName: 'Bek', mobileNumber: '92345678', password: 'Password123!', email: 'ben@email.com' });
  await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '93456789', password: 'Password123!', email: 'nike@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '2', unitNumber: '5', pointOfContact: 'David' });
  const staffId = (await StaffService.retrieveAllStaff())[0].id;
  const customerId = (await CustomerService.retrieveAllCustomers())[0].id;
  const merchantId = (await MerchantService.retrieveAllMerchants())[0].id;
  await CustomerService.activateCustomer(customerId);
  await MerchantService.approveMerchant(merchantId);
  await AnnouncementService.createAnnouncement({ title: 'Notice', description: 'The Ez2keep system will be disabled for maintenance on 21 September 2020', staffId });
  await NotificationService.createNotification({ title: 'New Order', description: 'Alice Ang made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Ong made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Wong made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Tan made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Ng made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'Notification 1',description: 'Customer notification 1', receiverId: customerId, receiverModel: 'Customer' });
  await NotificationService.createNotification({ title: 'Notification 2',description: 'Customer notification 2', receiverId: customerId, receiverModel: 'Customer' });
  await Category.create({ name: 'Fashion & Apparel', description: 'Sample Description' });
  let kiosk = await Kiosk.create({ address: '1 Sengkang Square', description: 'Sample Description'})
  let lockerType = await LockerType.create({ name: 'BIG', height: 120, width: 40, length: 50, price: 3 });
  await Locker.create({ lockerStatusEnum: 'Open', kioskId: kiosk.id, lockerTypeId: lockerType.id});
  await Advertisement.create({ image: '1601607853991.jpeg', title: 'Lazada sale', description: 'Lazada 50% off all items',  advertiserUrl: 'http://www.lazada.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '91111111', advertiserEmail: 'test1@email.com', approved: true })
  await Advertisement.create({ image: '1601608444371.jpeg', title: 'Shopee sale', description: 'Shopee 50% off all electronic items',  advertiserUrl: 'http://www.shopee.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '92222222', advertiserEmail: 'test2@email.com', approved: true })
  await Advertisement.create({ image: '1601608583950.jpeg', title: 'Qoo10 sale', description: 'Qoo10 50% off apparel items',  advertiserUrl: 'http://www.qoo10.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'test3@email.com', approved: true })
};

addDummyData();