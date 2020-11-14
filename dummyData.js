const Helper = require('./app/common/helper');
const CustomerService = require('./app/services/customerService');
const MerchantService = require('./app/services/merchantService');
const StaffService = require('./app/services/staffService');
const AnnouncementService = require('./app/services/announcementService');
const sequelize = require('./app/common/database');
const NotificationService = require('./app/services/notificationService');
const PromotionService = require('./app/services/promotionService');
const Category = require('./app/models/Category');
const Customer = require('./app/models/Customer');
const Locker = require('./app/models/Locker');
const Kiosk = require('./app/models/Kiosk');
const LockerType = require('./app/models/LockerType');
const Advertisement = require('./app/models/Advertisement');
const Product = require('./app/models/Product');
const BookingPackageModel = require('./app/models/BookingPackageModel');
const LockerActionRecord = require('./app/models/LockerActionRecord');
const Constants = require('./app/common/constants');
const BookingPackageService = require('./app/services/bookingPackageService');
const BookingService = require('./app/services/bookingService');
const CartService = require('./app/services/cartService');
const ProductVariationService = require('./app/services/productVariationService');
const ProductVariation = require('./app/models/ProductVariation');
const MaintenanceAction = require('./app/models/MaintenanceAction');
const orderService = require('./app/services/orderService');
const advertisementService = require('./app/services/advertisementService');
const Booking = require('./app/models/Booking');

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

  await CustomerService.createCustomer({ firstName: 'Ben', lastName: 'Bek', mobileNumber: '92585678', password: 'Password123!', email: 'ben@email.com', creditBalance: 10000 });
  await CustomerService.createCustomer({ firstName: 'Dan', lastName: 'Lim', mobileNumber: '92342448', password: 'Password123!', email: 'dan@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Chris', lastName: 'Tan', mobileNumber: '94785678', password: 'Password123!', email: 'chris@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Vivian', lastName: 'Toh', mobileNumber: '92638678', password: 'Password123!', email: 'vivian@email.com', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Mark', lastName: 'Ng', mobileNumber: '96677338', password: 'Password123!', email: 'shizhan@u.nus.edu', creditBalance: 1000 });
  await CustomerService.createCustomer({ firstName: 'Jane', lastName: 'Ong', mobileNumber: '93784632', password: 'Password123!', email: 'szhan100@gmail.com', creditBalance: 1000 });

  await CustomerService.addReferrer(5, 3)
  await CustomerService.addReferrer(5, 4)
  let nike = await MerchantService.createMerchant({ name: 'Nike', mobileNumber: '93456789', password: 'Password123!', email: 'nike@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '2', unitNumber: '5', pointOfContact: 'David', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'nike.png' });
  let toysRUs = await MerchantService.createMerchant({ name: 'Toys R\' Us', mobileNumber: '93456358', password: 'Password123!', email: 'toys@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '1', unitNumber: '9', pointOfContact: 'Don', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'toysrus.png' });

  const staffId = (await StaffService.retrieveAllStaff())[0].id;
  const customerId = (await CustomerService.retrieveAllCustomers())[0].id;
  const customerId2 = (await CustomerService.retrieveAllCustomers())[1].id;
  const customerId3 = (await CustomerService.retrieveAllCustomers())[2].id;
  const merchantId = (await MerchantService.retrieveAllMerchants())[0].id;

  await CustomerService.activateCustomer(customerId);
  await CustomerService.activateCustomer(customerId2);
  await CustomerService.activateCustomer(customerId3);
  await CustomerService.activateCustomer(customerId3);
  await MerchantService.approveMerchant(2);

  await AnnouncementService.createAnnouncement({ title: 'Notice', description: 'The Ez2keep system will be disabled for maintenance on 21 September 2020', staffId });
  await AnnouncementService.createAnnouncement({ title: 'COVID-19 notice', description: 'Please wear your masks and practice social distancing at all times', staffId });
  await AnnouncementService.createAnnouncement({ title: 'Mall early closure', description: 'Compass One will be closed at 10:00pm on 25 December 2020', staffId });
  await NotificationService.createNotification({ title: 'New Order', description: 'Alice Ang made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order', description: 'Bob Ong made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order', description: 'Callie Wong made an order', receiverId: nike.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order', description: 'Duke Tan made an order', receiverId: toysRUs.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'New Order', description: 'Jack Ng made an order', receiverId: toysRUs.id, receiverModel: 'Merchant' });
  await NotificationService.createNotification({ title: 'Notification 1', description: 'Customer notification 1', receiverId: customerId, receiverModel: 'Customer' });
  await NotificationService.createNotification({ title: 'Notification 2', description: 'Customer notification 2', receiverId: customerId, receiverModel: 'Customer' });

  let toyCategory = await Category.create({ name: 'Toys', description: 'Sample Description' });
  let bagCategory = await Category.create({ name: 'Bags', description: 'Sample Description' });
  let bottleCategory = await Category.create({ name: 'Water Bottles', description: 'Sample Description' });
  let apparelCategory = await Category.create({ name: 'Apparel', description: 'Sample Description' });

  await Product.create({ categoryId: bagCategory.id, merchantId: nike.id, name: 'Nike Venom Bag', unitPrice: 35.5, description: 'Black', quantityAvailable: 100, images: ['bag1.jpg'], });
  await Product.create({ categoryId: bagCategory.id, merchantId: nike.id, name: 'Nike Sports Duffel Bag', unitPrice: 50.2, description: 'Pink', quantityAvailable: 100, images: ['bag2.jpg'] });
  await Product.create({ categoryId: bottleCategory.id, merchantId: nike.id, name: 'Nike Sports Bottle', unitPrice: 20, description: 'Transparent 1L', quantityAvailable: 100, images: ['bo1.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Teddy Bear', unitPrice: 15, description: 'White Bear', quantityAvailable: 100, images: ['bear.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Doll', unitPrice: 15, description: 'Blue Hair Doll', quantityAvailable: 100, images: ['doll.jpg'] });
  await Product.create({ categoryId: toyCategory.id, merchantId: toysRUs.id, name: 'Car', unitPrice: 105.9, description: 'Red Car', quantityAvailable: 100, images: ['car.jpg'] });

  await Product.create({ categoryId: apparelCategory.id, merchantId: toysRUs.id, name: 'MEN Extra Fine Cotton Short Sleeve Shirt', unitPrice: 29.9, description: 'Red Car', quantityAvailable: 100, images: ['top5.jpg'] });
  await Product.create({ categoryId: apparelCategory.id, merchantId: toysRUs.id, name: 'MEN Extra Fine Cotton Short Sleeve Shirt', unitPrice: 35.9, description: 'Red Car', quantityAvailable: 100, images: ['top1.jpg'] });
  await Product.create({ categoryId: apparelCategory.id, merchantId: toysRUs.id, name: '100% cotton, plaid shirt for men, mens top, summer thin shirt', unitPrice: 35.6, description: 'Red Car', quantityAvailable: 100, images: ['top2.jpg'] });
  await Product.create({ categoryId: apparelCategory.id, merchantId: toysRUs.id, name: 'OPEN ORDER - Mens Top Kurta', unitPrice: 47.1, description: 'Red Car', quantityAvailable: 100, images: ['top3.jpg'] });

  let productVariationData1 = {
    name: 'Nike Venom Phantom Bag',
    unitPrice: 10,
    quantityAvailable: 60,
    productId: 1,
    image: 'phantomvenom.jpg'
  }

  let productVariationData2 = {
    name: 'Nike Hyper Venom Bag',
    unitPrice: 4,
    quantityAvailable: 30,
    productId: 1,
    image: 'hypervenom.jpg'
  }

  await sequelize.transaction(async (transaction) => {
    await ProductVariationService.createProductVariation(productVariationData1, transaction);
    await ProductVariationService.createProductVariation(productVariationData2, transaction);
  });

  await addMoreProducts();

  
  //console.log((await CartService.retrieveCartByCustomerId(1)).length);

  let kiosk = await Kiosk.create({ address: '1 Sengkang Square', description: 'Sample Description' });
  let kiosk2 = await Kiosk.create({ address: '3155 Commonwealth Ave West', description: 'Sample Description' });
  let lockerType1 = await LockerType.create({ name: 'BIG', lockerHeight: 120, lockerWidth: 40, lockerLength: 50, pricePerHalfHour: 3 });
  let lockerType2 = await LockerType.create({ name: 'MEDIUM', lockerHeight: 80, lockerWidth: 30, lockerLength: 50, pricePerHalfHour: 2 });
  let lockerType3 = await LockerType.create({ name: 'SMALL', lockerHeight: 30, lockerWidth: 20, lockerLength: 50, pricePerHalfHour: 1 });
  let lockerType4 = await LockerType.create({ name: 'TINY', lockerHeight: 10, lockerWidth: 10, lockerLength: 50, pricePerHalfHour: 1 });

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk2.id, lockerTypeId: lockerType4.id, lockerCode: '0a' });

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1a' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1b' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1c' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1d' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1e' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType1.id, lockerCode: '1f' });

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2a' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2b' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2c' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2d' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2e' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType2.id, lockerCode: '2f' });

  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3a' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3b' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3c' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3d' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3e' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3f' });
  await Locker.create({ lockerStatusEnum: 'Empty', kioskId: kiosk.id, lockerTypeId: lockerType3.id, lockerCode: '3g' });

  // await Advertisement.create({ image: '1601607853991.jpeg', title: 'Lazada sale', description: 'Lazada 50% off all items',  advertiserUrl: 'http://www.lazada.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '91111111', advertiserEmail: 'test1@email.com', approved: true });
  await Advertisement.create({ image: '1601608444371.jpeg', title: 'Shopee sale', description: 'Shopee 50% off all electronic items', advertiserUrl: 'http://www.shopee.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '92222222', advertiserEmail: 'test2@email.com', approved: true });
  await Advertisement.create({ image: '1601608583950.jpeg', title: 'Qoo10 sale', description: 'Qoo10 50% off apparel items', advertiserUrl: 'http://www.qoo10.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'test3@email.com', approved: true });
  await Advertisement.create({ image: 'nesAd1.png', title: 'Nescafe - savour the moment that matters', description: 'Shop Nescafe now', advertiserUrl: 'https://www.nescafe.com/sg/', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'nescafe@email.com', approved: true, expired: true });
  await Advertisement.create({ image: 'nesAd2.png', title: 'Wake up to life', description: 'Shop Nescafe now', advertiserUrl: 'https://www.nescafe.com/sg/', startDate: '2020-08-02T11:11:09+08:00', endDate: '2020-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '93333333', advertiserEmail: 'nescafe@email.com', approved: true });
  advertisementService.createAdvertisementAsMerchantWithoutAccount({ image: '1601607853991.jpeg', title: 'Lazada sale', description: 'Lazada 50% off all items', advertiserUrl: 'http://www.lazada.com', startDate: '2020-09-02T11:11:09+08:00', endDate: '2021-10-02T11:11:09+08:00', amountPaid: 100, advertiserMobile: '91111111', advertiserEmail: 'test1@email.com', approved: true })

  await LockerActionRecord.create({ timestamp: new Date(), lockerActionEnum: Constants.LockerAction.OPEN, lockerId: 1 });
  await LockerActionRecord.create({ timestamp: new Date(), lockerActionEnum: Constants.LockerAction.CLOSE, lockerId: 1 });
  await LockerActionRecord.create({ timestamp: new Date(), lockerActionEnum: Constants.LockerAction.OPEN, lockerId: 2 });
  await LockerActionRecord.create({ timestamp: new Date(), lockerActionEnum: Constants.LockerAction.CLOSE, lockerId: 2 });

  const promoData1 = {
    promoCode: "NIKE10OFF",
    title: 'Nike $10 Discount',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60),
    description: "save on spending!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: null,
    flatDiscount: 10,
    usageLimit: 20,
    merchantId: 1,
    minimumSpent: 10
  };

  const promoData2 = {
    promoCode: "NIKEOPENING10PERCENT",
    title: 'Nike 10% Off',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60),
    description: "save on spending a second time!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: 0.1,
    flatDiscount: null,
    usageLimit: 20,
    merchantId: 1,
    minimumSpent: 10
  };

  const promoData3 = {
    promoCode: "WELCOMEEZP",
    title: 'Easy Zippy Welcome Promotion',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60),
    description: "save on spending a second time!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: 0.1,
    flatDiscount: null,
    usageLimit: 20,
    staffId: 1,
    minimumSpent: 10
  };

  const promoData4 = {
    promoCode: 'XMAS10',
    title: 'Christmas Promotion',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60),
    description: "Buy on this platform for seasonal discounts!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: null,
    flatDiscount: 10,
    usageLimit: 20,
    staffId: 1,
    minimumSpent: 10
  };

  const promoDataNes1 = {
    promoCode: 'NESXMAS10',
    title: 'Nescafe Christmas Promotion',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 30 * 1000 * 60),
    description: "Buy on this platform for seasonal discounts!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: null,
    flatDiscount: 10,
    usageLimit: 20,
    merchantId: 6,
    minimumSpent: 10
  };

  const promoDataNes2 = {
    promoCode: 'NES1212',
    title: 'Nescafe 12-12 Promotion',
    startDate: new Date(new Date().getTime() + 28 * 30 * 1000 * 60),
    endDate: new Date(new Date().getTime() + 30 * 30 * 1000 * 60),
    description: "Buy on this platform for seasonal discounts!",
    termsAndConditions: "terms and conditions",
    percentageDiscount: 0.05,
    flatDiscount: null,
    usageLimit: 20,
    merchantId: 6,
    minimumSpent: 10
  };

  await sequelize.transaction(async (transaction) => {
    await PromotionService.createMerchantPromotion(promoData1, transaction);
    await PromotionService.createMerchantPromotion(promoData2, transaction);
    await PromotionService.createMerchantPromotion(promoDataNes1, transaction);
    await PromotionService.createMerchantPromotion(promoDataNes2, transaction);
    await PromotionService.createMallPromotion(promoData3, transaction);
    await PromotionService.createMallPromotion(promoData4, transaction);
  });

  await BookingPackageModel.create({ name: 'BIG Booking Package', description: 'Booking package for BIG lockers', quota: 1, price: 99, duration: 7, lockerTypeId: 1 });
  await BookingPackageModel.create({ name: 'MEDIUM Booking Package', description: 'Booking package for MEDIUM lockers', quota: 1, price: 29, duration: 30, lockerTypeId: 2 });
  await BookingPackageModel.create({ name: 'SMALL Booking Package', description: 'Booking package for SMALL lockers', quota: 1, price: 25, duration: 30, lockerTypeId: 3 });
  await BookingPackageModel.create({ name: 'TINY Booking Package', description: 'Booking package for TINY lockers', quota: 1, price: 25, duration: 30, lockerTypeId: 4 });

  await MaintenanceAction.create({ date: new Date(2020, 11, 11), description: 'Faulty locker fixed by contractor Mr Gerald Tan', lockerId: 1, kioskId: 1 })
  await MaintenanceAction.create({ date: new Date(2020, 04, 23), description: 'Faulty locker fixed by contractor Mr Albert Low', lockerId: 2, kioskId: 1 })
  await MaintenanceAction.create({ date: new Date(2020, 06, 01), description: 'Faulty locker fixed by contractor Mr Jason WOng', lockerId: 3, kioskId: 1 })

  let bookingPackageData1 = {
    customerId: 1,
    bookingPackageModelId: 1,
    kioskId: 1
  };

  let bookingPackageData2 = {
    merchantId: 1,
    bookingPackageModelId: 2,
    kioskId: 1
  };

  // let bookingPackageDataFor6 = {
  //   merchantId: 6,
  //   bookingPackageModelId: 3,
  //   kioskId: 1
  // };

  let bookingPackage1;
  let bookingPackage2;

  await sequelize.transaction(async (transaction) => {
    bookingPackage1 = await BookingPackageService.createBookingPackageForCustomer(bookingPackageData1, transaction)
    bookingPackage2 = await BookingPackageService.createBookingPackageForMerchant(bookingPackageData2, transaction)
    // bookingPackage3 = await BookingPackageService.createBookingPackageForMerchant(bookingPackageDataFor6, transaction)
  });

  console.log('Initializing booking');

  const startDate1 = new Date(new Date().getTime() + 24 * 60 * 60000);
  const endDate1 = new Date(new Date().getTime() + 24 * 60 * 60000 + 60 * 60000);

  const startDate2 = new Date(new Date().getTime() + 48 * 60 * 60000);
  const endDate2 = new Date(new Date().getTime() + 48 * 60 * 60000 + 60 * 60000);

  const startDate3 = new Date(new Date().getTime() + 72 * 60 * 60000);
  const endDate3 = new Date(new Date().getTime() + 72 * 60 * 60000 + 60 * 60000);

  const startDate4 = new Date(new Date().getTime() + 96 * 60 * 60000);
  const endDate4 = new Date(new Date().getTime() + 96 * 60 * 60000 + 60 * 60000);

  let bookingData1 = {
    startDate: startDate1,
    endDate: endDate1,
    bookingSourceEnum: Constants.BookingSource.MOBILE,
    customerId: 2,
    lockerTypeId: 1,
    kioskId: 1
  };

  let bookingData2 = {
    startDate: startDate2,
    endDate: endDate2,
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    merchantId: 2,
    lockerTypeId: 2,
    kioskId: 1
  };

  let bookingData3 = {
    startDate: startDate3,
    endDate: endDate3,
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    customerId: 1,
    bookingPackageId: 1,
  }

  let bookingData4 = {
    startDate: startDate4,
    endDate: endDate4,
    bookingSourceEnum: Constants.BookingSource.MOBILE,
    merchantId: 1,
    bookingPackageId: 2,
  }

  // let bookingData5 = {
  //   startDate: new Date(2020,09,26,20,40), 
  //   endDate: new Date(2020,09,26,23,20), 
  //   bookingSourceEnum: Constants.BookingSource.MOBILE, 
  //   merchantId: 1, 
  //   bookingPackageId: 2,
  // };

  //ADDITIONAL

  // let bookingData6 = {
  //   startDate: new Date(2020,09,24,20,40), 
  //   endDate: new Date(2020,09,24,23,20), 
  //   bookingSourceEnum: Constants.BookingSource.KIOSK, 
  //   customerId: 1, 
  //   bookingPackageId: 1,
  // }

  // let bookingData7 = {
  //   startDate: new Date(2020,09,24,21,40), 
  //   endDate: new Date(2020,09,24,23,20), 
  //   bookingSourceEnum: Constants.BookingSource.KIOSK, 
  //   customerId: 1, 
  //   bookingPackageId: 1,
  // }

  // let bookingData8 = {
  //   startDate: new Date(2020,09,24,21,40), 
  //   endDate: new Date(2020,09,24,23,20), 
  //   bookingSourceEnum: Constants.BookingSource.KIOSK, 
  //   customerId: 1, 
  //   bookingPackageId: 1,
  // }

  // let bookingData9 = {
  //   startDate: new Date(2020,09,25,11,40), 
  //   endDate: new Date(2020,09,25,14,00), 
  //   bookingSourceEnum: Constants.BookingSource.MOBILE, 
  //   customerId: 1, 
  //   lockerTypeId: 1,
  //   kioskId: 1
  // }

  // let bookingData10 = {
  //   startDate : new Date(2020,09,30,17,00,00),
  //   endDate : new Date(2020,09,30,19,00,00),
  //   bookingSourceEnum: Constants.BookingSource.KIOSK, 
  //   customerId: 1, 
  //   bookingPackageId: 1,
  // };

  const bookingData = {
    startDate: new Date(new Date().getTime() + 10 * 60000),
    endDate: new Date(new Date().getTime() + 500 * 60000),
    bookingSourceEnum: Constants.BookingSource.MOBILE,
    customerId: 1,
    lockerTypeId: 3,
    kioskId: 1
  }

  const bookingData5 = {
    startDate: new Date(new Date().getTime() + 15 * 60000),
    endDate: new Date(new Date().getTime() + 500 * 60000),
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    merchantId: 1,
    lockerTypeId: 2,
    kioskId: 1
  }

  const bookingData51 = {
    startDate: new Date(new Date().getTime() + 115 * 60000),
    endDate: new Date(new Date().getTime() + 900 * 60000),
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    merchantId: 6,
    lockerTypeId: 1,
    kioskId: 1
  }

  const bookingData52 = {
    startDate: new Date(new Date().getTime() + 3 * 115 * 60000),
    endDate: new Date(new Date().getTime() + 3 * 900 * 60000),
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    merchantId: 6,
    lockerTypeId: 1,
    kioskId: 1
  }

  const bookingData53 = {
    startDate: new Date(new Date().getTime() + 5 * 665 * 60000),
    endDate: new Date(new Date().getTime() + 5 * 800 * 60000),
    bookingSourceEnum: Constants.BookingSource.KIOSK,
    merchantId: 6,
    lockerTypeId: 2,
    kioskId: 1
  }

  // console.log(bookingPackage1.endDate.toLocaleString());
  // let times = await BookingService.checkBookingAllowed(bookingData);
  // console.log(times);

  await sequelize.transaction(async (transaction) => {
    await BookingService.createBookingByCustomer(bookingData1, transaction);
    console.log('Pass 1')
    await BookingService.createBookingByMerchant(bookingData2, transaction);
    console.log('Pass 2')
    await BookingService.createBookingWithBookingPackageByCustomer(bookingData3, transaction);
    console.log('Pass 3')
    await BookingService.createBookingWithBookingPackageByMerchant(bookingData4, transaction);
    console.log('Pass 4')
    // await BookingService.createBookingWithBookingPackageByMerchant(bookingData5, transaction);

    // console.log('*Pass 1')
    // await BookingService.createBookingWithBookingPackageByCustomer(bookingData6, transaction);
    // console.log('*Pass 2')
    // await BookingService.createBookingWithBookingPackageByCustomer(bookingData7, transaction);
    // console.log('*Pass 3')
    // await BookingService.createBookingWithBookingPackageByCustomer(bookingData8, transaction);

    // console.log('*Pass 4')
    // await BookingService.createBookingByCustomer(bookingData9, transaction);
    // console.log('*Pass 5')
    // await BookingService.createBookingByMerchant(bookingData5, transaction);

    // await BookingService.createBookingByCustomer(bookingData, transaction);
    
  });
  // await BookingService.createBookingByMerchant(bookingData51);
  // await BookingService.createBookingByMerchant(bookingData52);
  // await BookingService.createBookingByMerchant(bookingData53);

  await sequelize.transaction(async (transaction) => {
    console.log(await BookingService.addCollectorToBooking(1, 6, transaction))

  });

  // await sequelize.transaction(async (transaction) => {
  //   console.log(await BookingService.changeCollectorToBooking(1, 5, transaction))

  // });

  // await sequelize.transaction(async (transaction) => {
  //   console.log(await BookingService.removeCollectorToBooking(1, transaction))
  // });

  // await sequelize.transaction(async (transaction) => {
  //   //await BookingService.createBookingWithBookingPackageByMerchant(bookingData5, transaction);
  //   console.log(await BookingService.addCollectorToBooking(1, 1, transaction))
  //   console.log(await BookingService.changeCollectorToBooking(1, 3, transaction))
  //   console.log(await BookingService.removeCollectorToBooking(1, transaction))
  await sequelize.transaction(async (transaction) => {
    //console.log(await BookingService.cancelBooking(1, transaction))
  });

  // console.log('*****')
  // console.log(await BookingService.retrieveBookingByCustomerId(1))
  // console.log(await BookingService.retrieveBookingByCollectorId(3))
  // console.log(await BookingService.retrieveBookingByMerchantId(1))

  /**
   * TEST ORDER
   **/

  let cart1 = [
    { productId: null, productVariationId: 1, quantity: 2 },
    { productId: 2, productVariationId: null, quantity: 2 },
    { productId: 3, productVariationId: null, quantity: 2 },
    { productId: 6, productVariationId: null, quantity: 2 },
  ]

  let cart2 = [
    { productId: null, productVariationId: 1, quantity: 2 },
    { productId: 2, productVariationId: null, quantity: 2 },
    { productId: 3, productVariationId: null, quantity: 2 },
    { productId: 6, productVariationId: null, quantity: 2 },
  ]

  let cart3 = [
    { productId: null, productVariationId: 1, quantity: 2 },
    { productId: 2, productVariationId: null, quantity: 2 },
    { productId: 3, productVariationId: null, quantity: 2 },
    { productId: 6, productVariationId: null, quantity: 2 },
  ]

  let cart4 = [
    { productId: null, productVariationId: 1, quantity: 2 },
    { productId: 2, productVariationId: null, quantity: 2 },
    { productId: 3, productVariationId: null, quantity: 2 },
    { productId: 6, productVariationId: null, quantity: 2 },
  ]

  let cart5 = [
    { productId: 19, productVariationId: null, quantity: 2 },
    { productId: 20, productVariationId: null, quantity: 1 },
    { productId: null, productVariationId: 3, quantity: 1 }
  ]

  let orderData1 = {
    cart: cart1,
    promoIdUsed: 1,
    collectionMethodEnum: Constants.CollectionMethod.IN_STORE,
    //totalAmountPaid: 3, 
    customerId: 1
  }

  let orderData2 = {
    cart: cart2,
    promoIdUsed: 2,
    collectionMethodEnum: Constants.CollectionMethod.IN_STORE,
    //totalAmountPaid: 3, 
    customerId: 1
  }

  let orderData3 = {
    cart: cart3,
    promoIdUsed: 3,
    collectionMethodEnum: Constants.CollectionMethod.IN_STORE,
    //totalAmountPaid: 3, 
    customerId: 1
  }

  let orderData4 = {
    cart: cart4,
    promoIdUsed: 4,
    collectionMethodEnum: Constants.CollectionMethod.IN_STORE,
    //totalAmountPaid: 3, 
    customerId: 1
  }

  let orderData5 = {
    cart: cart5,
    promoIdUsed: null,
    collectionMethodEnum: Constants.CollectionMethod.KIOSK,
    //totalAmountPaid: 3, 
    customerId: 1
  }

  let orderVal1 = await orderService.createOrder(orderData1);
  console.log('create order cart item length: ' + cart2.length);
  let orderVal2 = await orderService.createOrder(orderData2);
  console.log('create order cart item length: ' + cart3.length);
  let orderVal3 = await orderService.createOrder(orderData3);
  console.log('create order cart item length: ' + cart4.length);
  let orderVal4 = await orderService.createOrder(orderData4);
  // console.log('create order cart item length: ' + cart5.length);
  // let orderVal5 = await orderService.createOrder(orderData5);


  let lineItem1 = {
    productVariationId: 1,
    productId: null,
    quantity: 5
  };

  let lineItem2 = {
    productVariationId: null,
    productId: 2,
    quantity: 2
  };

  let lineItem3 = {
    productVariationId: null,
    productId: 3,
    quantity: 3
  };

  let lineItem4 = {
    productVariationId: null,
    productId: 6,
    quantity: 3
  };

  let lineItem5 = {
    productVariationId: null,
    productId: 5,
    quantity: 11
  };

  let lineItems = new Array();
  lineItems.push(lineItem1);
  lineItems.push(lineItem2);
  lineItems.push(lineItem3);
  lineItems.push(lineItem4);

  await sequelize.transaction(async (transaction) => {
    await CartService.saveItemsToCart(1, { lineItems }, transaction);
  });
  await sequelize.transaction(async (transaction) => {
    await CartService.addToCart(1, lineItem5, transaction);
  });

  await sequelize.transaction(async (transaction) => {
    await CartService.addToCart(1, lineItem5, transaction);
  });


  // await sequelize.transaction(async (transaction) => {
  //   console.log(await orderService.updateOrderStatus(1, Constants.OrderStatus.READY_FOR_COLLECTION, transaction));

  // });

  // await sequelize.transaction(async (transaction) => {
  //   await orderService.updateOrderStatus(1, Constants.OrderStatus.COMPLETE, transaction);
  // });

  // console.log('RETRIEVE ALL')
  // console.log(await orderService.retrieveAllOrders());
  // console.log('RETRIEVE BY ID')
  // console.log(await orderService.retrieveOrderById(1));
  // console.log('RETRIEVE BY CUSTOMER ID')
  // console.log(await orderService.retrieveOrderByCustomerId(1));
  // console.log('RETRIEVE BY MERCHANT ID')
  // console.log(await orderService.retrieveOrderByMerchantId(1));
  // console.log('RETRIEVE ORDER LINE ITEMS');
  // console.log(await orderVal[0].getLineItems());

  
};

addDummyData();

const addMoreProducts = async () => {
  let mobileAndGadgets = await Category.create({ name: 'Mobile And Gadgets', description: 'Sample Description' });
  let homeAppliances = await Category.create({ name: 'Home Appliances', description: 'Sample Description' });
  let foodAndBeverages = await Category.create({ name: 'Food', description: 'Sample Description' });

  let Panasonic = await MerchantService.createMerchant({ name: 'Panasonic', mobileNumber: '97478789', password: 'Password123!', email: 'panasonic@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '2', unitNumber: '5', pointOfContact: 'David', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'panasonic.jpeg' });
  let Philips = await MerchantService.createMerchant({ name: 'Philips', mobileNumber: '91236358', password: 'Password123!', email: 'philips@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '1', unitNumber: '9', pointOfContact: 'Jon', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'philips.jpg' });
  let Samsung = await MerchantService.createMerchant({ name: 'Samsung', mobileNumber: '93456324', password: 'Password123!', email: 'samsung@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '4', unitNumber: '6', pointOfContact: 'Shermaine', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'samsung.png' });
  let Nescafe = await MerchantService.createMerchant({ name: 'Nescafe', mobileNumber: '93456453', password: 'Password123!', email: 'nescafe@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '3', unitNumber: '7', pointOfContact: 'Leo', creditBalance: 400, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'nescafe.jpg' });
  let KMart = await MerchantService.createMerchant({ name: 'KMart', mobileNumber: '93546358', password: 'Password123!', email: 'kmart@email.com', blk: '1', street: 'Sengkang Square', postalCode: '545078', floor: '1', unitNumber: '3', pointOfContact: 'Kate', creditBalance: 1000, tenancyAgreement: 'tenancy_agreement.pdf', merchantLogoImage: 'kmart.png' });
  await MerchantService.approveMerchant(7);
  await MerchantService.approveMerchant(6);
  await MerchantService.approveMerchant(5);
  await MerchantService.approveMerchant(4);

  await Product.create({ categoryId: homeAppliances.id, merchantId: Panasonic.id, name: 'Panasonic professional Nanoe Hair Dryer EH-ND53', unitPrice: 60.2, description: 'ES-LV9Q Black: The most important feature of this hair dryer is its Nanoe technology which uses electricity to split airborne moisture molecules into charged particles that bind to the hair. This results in smooth, shiny, healthy looking hair. ', quantityAvailable: 100, images: ['panasonic professional hair dryer EH-ND53.jpg'] });
  await Product.create({ categoryId: homeAppliances.id, merchantId: Panasonic.id, name: 'Panasonic ES-ST2N-K751 Rechargeable Wet/Dry 3 Blade Shaver', unitPrice: 64.2, description: '13,00cpm/min linear motor for quick and precise shave Multi-Fit Arc Blade follows Facial Contour for closer shaver Wet/Dry Usage 1 year', quantityAvailable: 100, images: ['panasonic ES-LV9Q shaver black.jpg'] });
  await Product.create({ categoryId: foodAndBeverages.id, merchantId: KMart.id, name: 'Kmart Koseomi Rice Crackers', unitPrice: 10.2, description: 'Nice crackers', quantityAvailable: 100, images: ['kmart koseomi.jpg'] });
  await Product.create({ categoryId: foodAndBeverages.id, merchantId: KMart.id, name: 'Kmart Yakult Icecream', unitPrice: 3.2, description: 'Packing method: bagged Net content: 360g Whether it contains sugar: sugar Is it ready to eat: ready to eat', quantityAvailable: 100, images: ['kmart yakult icecream.jpg'] });
  await Product.create({ categoryId: homeAppliances.id, merchantId: KMart.id, name: 'Kmart Honey Butter Chips Haitai', unitPrice: 7.6, description: 'Packing method: bagged Net content: 360g Whether it contains sugar: sugar Is it ready to eat: ready to eat', quantityAvailable: 100, images: ['kmart-honey-chips.jpg'] });
  await Product.create({ categoryId: homeAppliances.id, merchantId: KMart.id, name: 'Kmart L-GA candy 360-Vita', unitPrice: 9.3, description: 'Packing method: bagged Net content: 360g Whether it contains sugar: sugar Is it ready to eat: ready to eat', quantityAvailable: 100, images: ['kmart lga candy.jpg'] });
  await Product.create({ categoryId: mobileAndGadgets.id, merchantId: Samsung.id, name: 'Samsung S20 Phone Pink', unitPrice: 1030.0, description: 'Triple rear camera with 30x Space Zoom 6.2" Dynamic AMOLED2x display with 120Hz refresh Shoot night shots like a pro 4, 000mAh (typical) Battery and 25W Super Fast Charging Always-on display', quantityAvailable: 100, images: ['samsung s20.jpg'] });
  await Product.create({ categoryId: homeAppliances.id, merchantId: Philips.id, name: 'Philips Espresso Maker JLGE-3225 Black', unitPrice: 230.2, description: 'Stainless steel filter holder, frame and cup tray, steel cup holder, chrome-plated base, ', quantityAvailable: 100, images: ['philips-espresso-machine.jpg', 'philips-espresso-machine-silver.jpg'] });
  await Product.create({ categoryId: foodAndBeverages.id, merchantId: Nescafe.id, name: 'Nescafé Gold Blend Coffee', unitPrice: 6.2, description: 'MicroGround Instant Coffee is a blend of finely ground coffee beans and premium instant coffee with non dairy creamer and the fi nest sugar', quantityAvailable: 100, images: ['nescafe-gold blend instant coffee.jpg'] });
  await Product.create({ categoryId: foodAndBeverages.id, merchantId: Nescafe.id, name: 'Nescafe Gold Origins Cap Columbia', unitPrice: 5.4, description: 'MicroGround Instant Coffee is a blend of finely ground coffee beans and premium instant coffee with non dairy creamer and the fi nest sugar', quantityAvailable: 100, images: ['nescafe-gold blend alta rica.jpg', 'nescafe-gold blend var 2.jpeg'] });

  let productVariationDataNescafe1 = {
    name: 'Nescafe Gold Origins Alta Rica',
    unitPrice: 7.5,
    quantityAvailable: 60,
    productId: 20,
    image: 'nescafe-gold blend var 1.jpeg'
  }
  await ProductVariationService.createProductVariation(productVariationDataNescafe1);

  let productVariationDataPhillipscoffee = {
    name: 'Philips Espresso Maker JLGE-3225 Silver',
    unitPrice: 274.5,
    quantityAvailable: 60,
    productId: 18,
    image: 'philips-espresso-machine-silver.jpg'
  }
  await ProductVariationService.createProductVariation(productVariationDataPhillipscoffee);

  await (await Product.findByPk(1)).update({ quantitySold: 20 });
  await (await Product.findByPk(2)).update({ quantitySold: 33 });
  await (await Product.findByPk(4)).update({ quantitySold: 37 });
  await (await Product.findByPk(5)).update({ quantitySold: 130 });
  await (await Product.findByPk(6)).update({ quantitySold: 310 });
  await (await Product.findByPk(7)).update({ quantitySold: 50 });
  await (await Product.findByPk(8)).update({ quantitySold: 3130 });
  await (await Product.findByPk(10)).update({ quantitySold: 210 });
  await (await Product.findByPk(13)).update({ quantitySold: 31 });
  await (await Product.findByPk(14)).update({ quantitySold: 68 });
  await (await Product.findByPk(15)).update({ quantitySold: 326 });
  await (await Product.findByPk(16)).update({ quantitySold: 117 });
  await (await Product.findByPk(17)).update({ quantitySold: 230 });
}