const Helper = require('./app/common/helper');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');
const AnnouncementService = require('./app/services/announcementService');
const sequelize = require('./app/common/database');
const NotificationService = require('./app/services/notificationService');
const PromotionService = require('./app/services/promotionService');
const Category = require('./app/models/Category');
const Locker = require('./app/models/Locker');
const Kiosk = require('./app/models/Kiosk');
const LockerType = require('./app/models/LockerType');
const Advertisement = require('./app/models/Advertisement');
const Product = require('./app/models/Product');
const BookingPackageModel = require('./app/models/BookingPackageModel');
const Constants = require('./app/common/constants');
const BookingPackageService = require('./app/services/bookingPackageService');
const BookingService = require('./app/services/bookingService');

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

  await CustomerService.createCustomer({ firstName: 'Ben', lastName: 'Bek', mobileNumber: '92585678', password: 'Password123!', email: 'ben@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Dan', lastName: 'Lim', mobileNumber: '92342448', password: 'Password123!', email: 'dan@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Chris', lastName: 'Tan', mobileNumber: '94785678', password: 'Password123!', email: 'chris@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Vivian', lastName: 'Toh', mobileNumber: '92638678', password: 'Password123!', email: 'vivian@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'With', lastName: 'Credit', mobileNumber: '96677838', password: 'Password123!', email: 'withcredit@email.com', creditBalance: 1000 });

  let nike = await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '93456789', password: 'Password123!', email: 'nike@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '2', unitNumber: '5', pointOfContact: 'David', creditBalance:1000 });
  let toysRUs = await MerchantService.createMerchant({ name: 'Toys R\' Us', mobileNumber: '93456358', password: 'Password123!', email: 'toys@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '1', unitNumber: '9', pointOfContact: 'Don', creditBalance: 1000 });

  const staffId = (await StaffService.retrieveAllStaff())[0].id;
  const customerId = (await CustomerService.retrieveAllCustomers())[0].id;
  const merchantId = (await MerchantService.retrieveAllMerchants())[0].id;

  await CustomerService.activateCustomer(customerId);
  await MerchantService.approveMerchant(merchantId);

  await AnnouncementService.createAnnouncement({ title: 'Notice', description: 'The Ez2keep system will be disabled for maintenance on 21 September 2020', staffId });
  await AnnouncementService.createAnnouncement({ title: 'COVID-19 notice', description: 'Please wear your masks and practice social distancing at all times', staffId });
  await AnnouncementService.createAnnouncement({ title: 'Mall early closure', description: 'Compass One will be closed at 10:00pm on 25 December 2020', staffId });
  await NotificationService.createNotification({ title: 'New Order', description: 'Alice Ang made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Bob Ong made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Callie Wong made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Duke Tan made an order', receiverId: toysRUs.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order',description: 'Jack Ng made an order', receiverId: toysRUs.id, receiverModel: 'Merchant' });
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
  let lockerType1 = await LockerType.create({ name: 'BIG', lockerHeight: 120, lockerWidth: 40, lockerLength: 50, pricePerHalfHour: 3 });
  let lockerType2 = await LockerType.create({ name: 'MEDIUM', lockerHeight: 80, lockerWidth: 30, lockerLength: 50, pricePerHalfHour: 2 });
  let lockerType3 = await LockerType.create({ name: 'SMALL', lockerHeight: 30, lockerWidth: 20, lockerLength: 50, pricePerHalfHour: 1 });

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id});

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id});
  
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id});
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id});

  await Advertisement.create({ image: '1601607853991.jpeg', title: 'Lazada sale', description: 'Lazada 50% off all items',  advertiserUrl: 'http://www.lazada.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '91111111', advertiserEmail: 'test1@email.com', approved: true })
  await Advertisement.create({ image: '1601608444371.jpeg', title: 'Shopee sale', description: 'Shopee 50% off all electronic items',  advertiserUrl: 'http://www.shopee.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '92222222', advertiserEmail: 'test2@email.com', approved: true })
  await Advertisement.create({ image: '1601608583950.jpeg', title: 'Qoo10 sale', description: 'Qoo10 50% off apparel items',  advertiserUrl: 'http://www.qoo10.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'test3@email.com', approved: true })

  const promoData1 = {
    promoCode: "PROMOCODE1", 
    startDate: new Date(new Date().getTime() + 30 * 1000 * 60), 
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60), 
    description: "save on spending!", 
    termsAndConditions: "terms and conditions", 
    percentageDiscount: null, 
    flatDiscount: 10, 
    usageLimit: 20, 
    merchantId: 1
  }

  const promoData2 = {
    promoCode: "PROMOCODE2", 
    startDate: new Date(new Date().getTime() + 30 * 1000 * 60), 
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60), 
    description: "save on spending a second time!", 
    termsAndConditions: "terms and conditions", 
    percentageDiscount: 0.1, 
    flatDiscount: null, 
    usageLimit: 20, 
    merchantId: 1
  }

  const promoData3 = {
    promoCode: "PROMOCODEMALL1", 
    startDate: new Date(new Date().getTime() + 30 * 1000 * 60), 
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60), 
    description: "save on spending a second time!", 
    termsAndConditions: "terms and conditions", 
    percentageDiscount: 0.1, 
    flatDiscount: null, 
    usageLimit: 20, 
    staffId: 1
  }

  await sequelize.transaction(async (transaction) => {
    await PromotionService.createMerchantPromotion(promoData1, transaction);
    await PromotionService.createMerchantPromotion(promoData2, transaction);
    await PromotionService.createMallPromotion(promoData3, transaction);
  });

  await BookingPackageModel.create({ name: 'BIG Booking Package', description: 'Booking package for BIG lockers', quota: 1, price: 39, duration: 30, lockerTypeId: 1});
  await BookingPackageModel.create({ name: 'MEDIUM Booking Package', description: 'Booking package for MEDIUM lockers', quota: 1, price: 29, duration: 30, lockerTypeId: 2});
  await BookingPackageModel.create({ name: 'SMALL Booking Package', description: 'Booking package for SMALL lockers', quota: 1, price: 25, duration: 30, lockerTypeId: 3});

  let bookingPackageData1 = {
    customerId: 1, 
    bookingPackageModelId: 1
  }

  let bookingPackageData2 = {
    merchantId: 1, 
    bookingPackageModelId: 2
  }

  await sequelize.transaction(async (transaction) => {
    await BookingPackageService.createBookingPackageForCustomer(bookingPackageData1, transaction)
    await BookingPackageService.createBookingPackageForMerchant(bookingPackageData2, transaction)
  });

  let bookingData1 = {
    promoIdUsed: null, 
    startDate: new Date(2020,10,3,12,10), 
    endDate: new Date(2020,10,3,13,20), 
    bookingSourceEnum: Constants.BookingSource.Mobile, 
    customerId: 2, 
    lockerTypeId: 1
  }

  let bookingData2 = {
    promoIdUsed: null, 
    startDate: new Date(2020,10,4,09,10), 
    endDate: new Date(2020,10,4,17,20), 
    bookingSourceEnum: Constants.BookingSource.Kiosk, 
    merchantId: 2, 
    lockerTypeId: 2
  }

  let bookingData3 = {
    promoIdUsed: null, 
    startDate: new Date(2020,10,3,10,00), 
    endDate: new Date(2020,10,3,10,20), 
    bookingSourceEnum: Constants.BookingSource.Kiosk, 
    customerId: 1, 
    bookingPackageId: 1,
  }

  let bookingData4 = {
    promoIdUsed: null, 
    startDate: new Date(2020,10,3,12,10), 
    endDate: new Date(2020,10,4,07,20), 
    bookingSourceEnum: Constants.BookingSource.Mobile, 
    merchantId: 1, 
    bookingPackageId: 2
  }

  let bookingData5 = {
    promoIdUsed: null, 
    startDate: new Date(2020,09,16,20,40), 
    endDate: new Date(2020,09,16,23,20), 
    bookingSourceEnum: Constants.BookingSource.Mobile, 
    merchantId: 1, 
    bookingPackageId: 2
  }

  await sequelize.transaction(async (transaction) => {
    await BookingService.createBookingByCustomer(bookingData1, transaction);
    console.log('Pass 1')
    await BookingService.createBookingByMerchant(bookingData2, transaction);
    console.log('Pass 2')
    await BookingService.createBookingWithBookingPackageByCustomer(bookingData3, transaction);
    console.log('Pass 3')
    await BookingService.createBookingWithBookingPackageByMerchant(bookingData4, transaction);
    console.log('Pass 4')
    await BookingService.createBookingWithBookingPackageByMerchant(bookingData5, transaction);
  });

  // await sequelize.transaction(async (transaction) => {
  //   //await BookingService.createBookingWithBookingPackageByMerchant(bookingData5, transaction);
  //   console.log(await BookingService.addCollectorToBooking(1, 3, transaction))
  //   console.log(await BookingService.addCollectorToBooking(2, 3, transaction))
  //   console.log(await BookingService.changeCollectorToBooking(2, 4, transaction))
  //   console.log(await BookingService.removeCollectorToBooking(1, transaction))
  //   //console.log(await BookingService.cancelBooking(5, transaction))
  // });

  // console.log('*****')
  // console.log(await BookingService.retrieveBookingByCustomerId(1))
  // console.log(await BookingService.retrieveBookingByCollectorId(3))
  // console.log(await BookingService.retrieveBookingByMerchantId(1))


  
};

addDummyData();