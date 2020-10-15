const Helper = require('./app/common/helper');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');
const AnnouncementService = require('./app/services/announcementService');
const NotificationService = require('./app/services/notificationService');
const Category = require('./app/models/Category');
const Locker = require('./app/models/Locker');
const Kiosk = require('./app/models/Kiosk');
const LockerType = require('./app/models/LockerType');
const Advertisement = require('./app/models/Advertisement');
const Product = require('./app/models/Product');
const BookingPackageModel = require('./app/models/BookingPackageModel');

const addDummyData = async () => {
  const staff1 = await StaffService.createStaff({ firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', email: 'alice@email.com', staffRoleEnum: 'Admin' });
  const staff2 = await StaffService.createStaff({ firstName: 'Alan', lastName: 'Tan', mobileNumber: '91238467', email: 'alan@email.com', staffRoleEnum: 'Admin' });
  const staff3 = await StaffService.createStaff({ firstName: 'Billy', lastName: 'Lim', mobileNumber: '91144567', email: 'billy@email.com', staffRoleEnum: 'Admin' });
  const staff4 = await StaffService.createStaff({ firstName: 'Bryce', lastName: 'Toh', mobileNumber: '95334567', email: 'bryce@email.com', staffRoleEnum: 'Employee' });
  const staff5 = await StaffService.createStaff({ firstName: 'Dave', lastName: 'Ang', mobileNumber: '81234567', email: 'dave@email.com', staffRoleEnum: 'Employee' });
  const staff6 = await StaffService.createStaff({ firstName: 'Eddy', lastName: 'Sim', mobileNumber: '85334567', email: 'eddy@email.com', staffRoleEnum: 'Employee' });
  await staff1.update({ password: await Helper.hashPassword('Password123!') });
  await staff2.update({ password: await Helper.hashPassword('Password123!') });
  await staff3.update({ password: await Helper.hashPassword('Password123!') });
  await staff4.update({ password: await Helper.hashPassword('Password123!') });
  await staff5.update({ password: await Helper.hashPassword('Password123!') });
  await staff6.update({ password: await Helper.hashPassword('Password123!') });
  await CustomerService.createCustomer({ firstName: 'Ben', lastName: 'Bek', mobileNumber: '92585678', password: 'Password123!', email: 'ben@email.com' });
  await CustomerService.createCustomer({ firstName: 'Dan', lastName: 'Lim', mobileNumber: '92342448', password: 'Password123!', email: 'dan@email.com' });
  await CustomerService.createCustomer({ firstName: 'Chris', lastName: 'Tan', mobileNumber: '94785678', password: 'Password123!', email: 'chris@email.com' });
  await CustomerService.createCustomer({ firstName: 'Vivian', lastName: 'Toh', mobileNumber: '92638678', password: 'Password123!', email: 'vivian@email.com' });
  await CustomerService.createCustomer({ firstName: 'With', lastName: 'Credit', mobileNumber: '96677838', password: 'Password123!', email: 'withcredit@email.com', creditBalance: 10000 });
  let nike = await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '93456789', password: 'Password123!', email: 'nike@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '2', unitNumber: '5', pointOfContact: 'David', creditBalance:100000 });
  let toysRUs = await MerchantService.createMerchant({ name: 'Toys R\' Us', mobileNumber: '93456358', password: 'Password123!', email: 'toys@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '1', unitNumber: '9', pointOfContact: 'Don' });
  const staffId = (await StaffService.retrieveAllStaff())[0].id;
  const customerId = (await CustomerService.retrieveAllCustomers())[0].id;
  const merchantId = (await MerchantService.retrieveAllMerchants())[0].id;
  await CustomerService.activateCustomer(customerId);
  await MerchantService.approveMerchant(merchantId);
  await AnnouncementService.createAnnouncement({ title: 'Notice', description: 'The Ez2keep system will be disabled for maintenance on 21 September 2020', staffId });
  await AnnouncementService.createAnnouncement({ title: 'COVID-19 notice', description: 'Please wear your masks and practice social distancing at all times', staffId });
  await AnnouncementService.createAnnouncement({ title: 'Mall early closure', description: 'Compass One will be closed at 10:00pm on 25 December 2020', staffId });
  await NotificationService.createNotification({ title: 'New Order', description: 'Alice Ang made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Ong made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Wong made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Tan made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Alice Ng made an order', receiverId: merchantId, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'Notification 1',description: 'Customer notification 1', receiverId: customerId, receiverModel: 'Customer' });
  await NotificationService.createNotification({ title: 'Notification 2',description: 'Customer notification 2', receiverId: customerId, receiverModel: 'Customer' });
  let toyCategory = await Category.create({ name: 'Toys', description: 'Sample Description' });
  let bagCategory = await Category.create({ name: 'Bags', description: 'Sample Description' });
  let bottleCategory = await Category.create({ name: 'Water Bottles', description: 'Sample Description' });
  await Product.create({ categoryId: bagCategory.id, merchantId: nike.id, name: 'Nike Venom Bag', unitPrice: 35.5, description: 'Black', quantityAvailable: 10, images: ['bag1.jpg'],  });
  await Product.create({ categoryId: bagCategory.id, merchantId: nike.id, name: 'Nike Sports Duffel Bag', unitPrice: 50.2, description: 'Pink', quantityAvailable: 10, images: ['bag2.jpg'] });
  await Product.create({ categoryId: bottleCategory.id, merchantId: nike.id, name: 'Nike Sports Bottle', unitPrice: 20, description: 'Transparent 1L', quantityAvailable: 10, images: ['bo1.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Teddy Bear', unitPrice: 15, description: 'White Bear', quantityAvailable: 10, images: ['bear.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Doll', unitPrice: 15, description: 'Blue Hair Doll', quantityAvailable: 10, images: ['doll.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Car', unitPrice: 105.9, description: 'Red Car', quantityAvailable: 10, images: ['car.jpg'] });
  let kiosk = await Kiosk.create({ address: '1 Sengkang Square', description: 'Sample Description'})
  let lockerType1 = await LockerType.create({ name: 'BIG', height: 120, width: 40, length: 50, price: 3 });
  let lockerType2 = await LockerType.create({ name: 'MEDIUM', height: 90, width: 30, length: 40, price: 2.5 });
  await Locker.create({ lockerStatusEnum: 'Open', kioskId: kiosk.id, lockerTypeId: lockerType1.id});
  await Locker.create({ lockerStatusEnum: 'Open', kioskId: kiosk.id, lockerTypeId: lockerType1.id});
  await Locker.create({ lockerStatusEnum: 'Open', kioskId: kiosk.id, lockerTypeId: lockerType2.id});
  await Advertisement.create({ image: '1601607853991.jpeg', title: 'Lazada sale', description: 'Lazada 50% off all items',  advertiserUrl: 'http://www.lazada.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '91111111', advertiserEmail: 'test1@email.com', approved: true })
  await Advertisement.create({ image: '1601608444371.jpeg', title: 'Shopee sale', description: 'Shopee 50% off all electronic items',  advertiserUrl: 'http://www.shopee.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '92222222', advertiserEmail: 'test2@email.com', approved: true })
  await Advertisement.create({ image: '1601608583950.jpeg', title: 'Qoo10 sale', description: 'Qoo10 50% off apparel items',  advertiserUrl: 'http://www.qoo10.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'test3@email.com', approved: true })

  await BookingPackageModel.create({ name: 'Booking Package 1', description: 'Booking pacakge 1 description', quota: 2, price: 39, duration: 30, lockerTypeId: 1});
};

addDummyData();