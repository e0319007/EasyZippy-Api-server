const express = require('express');
const router = express.Router();
const Authenticator = require('../middleware/authenticator');
const Upload = require('../middleware/upload');

const AdvertisementController = require('../controllers/advertisementController');
const AnnouncementController = require('../controllers/announcementController');
const CartController = require('../controllers/cartController');
const BookingController = require('../controllers/bookingController');
const BookingPackageController = require('../controllers/bookingPackageController');
const BookingPackageModelController = require('../controllers/bookingPackageModelController');
const CategoryController = require('../controllers/categoryController');
const CustomerController = require('../controllers/customerController');
const KioskController = require('../controllers/kioskController');
const lockerActionRecordController = require('../controllers/lockerActionRecordController');
const LockerController = require('../controllers/lockerController');
const LockerTypeController = require('../controllers/lockerTypeController');
const MaintenanceActionController = require('../controllers/maintenanceActionController');
const MerchantController = require('../controllers/merchantController');
const NotificationController = require('../controllers/notificationController');
const OrderController = require('../controllers/orderController');
const PaymentController = require('../controllers/paymentController');
const ProductController = require('../controllers/productController');
const ProductVariationController = require('../controllers/productVariationController');
const PromotionController = require('../controllers/promotionController');
const StaffController = require('../controllers/staffController');

//Advertisement
router.post('/createAdvertisementAsStaff', Authenticator.staffOnly, AdvertisementController.createAdvertisementAsStaff);
router.post('/createAdvertisementAsMerchant', Authenticator.merchantOnly, AdvertisementController.createAdvertisementAsMerchant);
router.post('/createAdvertisementAsMerchantWithoutAccount', AdvertisementController.createAdvertisementAsMerchantWithoutAccount);
router.post('/advertisement/addImage', Upload.preUploadCheckForImg, AdvertisementController.addImageForAdvertisement);
router.get('/advertisement/merchant/:merchantId', Authenticator.merchantOnly, AdvertisementController.retrieveAdvertisementByMerchantId);
router.get('/advertisement/staff/:staffId', Authenticator.staffOnly, AdvertisementController.retrieveAdvertisementByStaffId);
router.get('/advertisement/:id', Authenticator.merchantAndStaffOnly, AdvertisementController.retrieveAdvertisementById);
router.get('/advertisements/ongoing', Authenticator.customerAndStaffOnly, AdvertisementController.retrieveOngoingAdvertisement);
router.get('/advertisements', Authenticator.staffOnly, AdvertisementController.retrieveAllAdvertisement);
router.get('/approvedAdvertisements', Authenticator.staffOnly, AdvertisementController.retrieveApprovedAdvertisement);
router.get('/unapprovedAdvertisements', Authenticator.staffOnly, AdvertisementController.retrieveUnapprovedAdvertisement);
router.put('/approveAdvertisement/:id', Authenticator.staffOnly, AdvertisementController.toggleApproveAdvertisement);
router.put('/setExpireAdvertisement/:id', Authenticator.staffOnly, AdvertisementController.setExpireAdvertisement);
router.put('/advertisement/toggleDisable/:id', Authenticator.merchantAndStaffOnly, AdvertisementController.toggleDisableAdvertisement);
router.put('/deleteAdvertisement/:id', Authenticator.merchantAndStaffOnly, AdvertisementController.deleteAdvertisement);
router.put('/advertisement/:id', Authenticator.merchantAndStaffOnly, AdvertisementController.updateAdvertisement);

//Announcement
router.get('/announcement/:id', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.retrieveAnnouncement);
router.get('/announcement/staff/:staffId', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.retrieveAnnouncementByStaffId);
router.get('/announcements', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.retrieveAllAnnouncement);
router.get('/latestAnnouncement', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.retrieveLatestAnnouncement);
router.get('/announcements/:count', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.retrieveLatestAnnouncementByLimit);
router.put('/announcement/:id', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.updateAnnouncement);
router.post('/announcement', Authenticator.customerAndMerchantAndStaffOnly, AnnouncementController.createAnnouncement);
router.post('/announcement/subscribe', AnnouncementController.subscribeDeviceToAnnouncements);
router.put('/deleteAnnouncement/:id', Authenticator.staffOnly, AnnouncementController.deleteAnnouncement);

//BookingPackageModel
router.get('/bookingPackageModel/:id', Authenticator.customerAndMerchantAndStaffOnly, BookingPackageModelController.retrieveBookingPackageModel);
router.get('/bookingPackageModels', Authenticator.customerAndMerchantAndStaffOnly, BookingPackageModelController.retrieveAllBookingPackageModel);
router.get('/bookingPackageModels/:kioskId', Authenticator.customerAndMerchantAndStaffOnly, BookingPackageModelController.retrieveBookingPackageModelsByKioskId);
router.put('/bookingPackageModel/toggleDisable/:id', Authenticator.staffOnly, BookingPackageModelController.toggleDisableBookingPackageModel);
router.put('/bookingPackageModel/:id', Authenticator.staffOnly, BookingPackageModelController.updateBookingPackageModel);
router.post('/bookingPackageModel', Authenticator.staffOnly, BookingPackageModelController.createBookingPackageModel);
router.put('/deleteBookingPackageModel/:id', Authenticator.staffOnly, BookingPackageModelController.deleteBookingPackageModel);

//BookingPackage
router.get('/bookingPackage/:id', Authenticator.customerAndMerchantAndStaffOnly, BookingPackageController.retrieveBookingPackageByBookingPackageId);
router.get('/customerBookingPackages/:customerId', Authenticator.customerAndStaffOnly, BookingPackageController.retrieveAllBookingPackageByCustomerId);
router.get('/customerBookingPackage/:customerId', Authenticator.customerAndStaffOnly, BookingPackageController.retrieveCurrentBookingPackageByCustomerId);
router.get('/merchantBookingPackages/:merchantId', Authenticator.merchantAndStaffOnly, BookingPackageController.retrieveAllBookingPackageByMerchantId);
router.get('/merchantBookingPackage/:merchantId', Authenticator.merchantAndStaffOnly, BookingPackageController.retrieveCurrentBookingPackageByMerchantId);
router.post('/customerBookingPackage', Authenticator.customerOnly, BookingPackageController.buyBookingPackageForCustomer);
router.post('/merchantBookingPackage', Authenticator.merchantOnly, BookingPackageController.buyBookingPackageForMerchant);
router.post('/validBookingPackage', Authenticator.customerAndMerchantOnly, BookingPackageController.retrieveValidBookingPackageByCustomerIdAndLockerTypeId);

//Booking
router.get('/customerBooking/upcoming/:id', Authenticator.customerAndStaffOnly, BookingController.retrieveUpcomingBookingsByCustomerId);
router.get('/customerBooking/ongoing/:id', Authenticator.customerAndStaffOnly, BookingController.retrieveOngoingBookingsByCustomerId);
router.get('/customerBooking/:id', Authenticator.customerAndStaffOnly, BookingController.retrieveBookingByCustomerId);
router.get('/merchantBooking/upcoming/:id', Authenticator.merchantAndStaffOnly, BookingController.retrieveUpcomingBookingsByMerchantId);
router.get('/merchantBooking/ongoing/:id', Authenticator.merchantAndStaffOnly, BookingController.retrieveOngoingBookingsByMerchantId);
router.get('/merchantBooking/:id', Authenticator.merchantAndStaffOnly, BookingController.retrieveBookingByMerchantId);
router.get('/bookingByOrder/:orderId', Authenticator.customerAndMerchantAndStaffOnly, BookingController.retrieveBookingByOrderId);
router.get('/booking/:id', Authenticator.customerAndMerchantAndStaffOnly, BookingController.retrieveBookingById);
router.get('/customerBookings', Authenticator.staffOnly, BookingController.retrieveAllBookingsByCustomer);
router.get('/merchantBookings', Authenticator.staffOnly, BookingController.retrieveAllBookingsByMerchant);
router.get('/collectorBooking/:collectorId', Authenticator.customerAndMerchantAndStaffOnly, BookingController.retrieveBookingByCollectorId);
router.put('/booking/:id', Authenticator.customerAndMerchantAndStaffOnly, BookingController.cancelBooking);
router.put('/tagOrderToBooking', Authenticator.merchantAndStaffOnly, BookingController.tagBookingToOrder);
router.put('/addCollectorToBooking', Authenticator.customerAndMerchantAndStaffOnly, BookingController.addCollectorToBooking);
router.put('/removeCollectorToBooking', Authenticator.customerAndMerchantAndStaffOnly, BookingController.removeCollectorToBooking);
router.put('/changeCollectorToBooking', Authenticator.customerAndMerchantAndStaffOnly, BookingController.changeCollectorToBooking);
router.put('/cancelBooking/:id', Authenticator.customerAndMerchantOnly, BookingController.cancelBooking);
router.post('/booking/customer', Authenticator.customerAndMerchantAndStaffOnly, BookingController.createBookingByCustomer);
router.post('/booking/merchant', Authenticator.customerAndMerchantAndStaffOnly, BookingController.createBookingByMerchant);
router.post('/booking/bookingPackage/customer', Authenticator.customerAndMerchantAndStaffOnly, BookingController.createBookingWithBookingPackageByCustomer);
router.post('/booking/bookingPackage/merchant', Authenticator.customerAndMerchantAndStaffOnly, BookingController.createBookingWithBookingPackageByMerchant);
router.post('/checkBookingAllowed', Authenticator.customerAndMerchantAndStaffOnly, BookingController.checkBookingAllowed);


//Cart
router.get('/retrieveCart/:customerId', CartController.retrieveCartByCustomerId);
router.put('/saveCart/:customerId', CartController.saveItemsToCart);
router.post('/retrieveInvalidCartItems', CartController.getInvalidCartItems);

//Category
router.get('/category/:id', Authenticator.customerAndMerchantAndStaffOnly, CategoryController.retrieveCategory);
router.get('/categories', Authenticator.customerAndMerchantAndStaffOnly, CategoryController.retrieveAllCategory);
router.put('/category/:id',  Authenticator.staffOnly, CategoryController.updateCategory);
router.put('/deleteCategory/:id', Authenticator.staffOnly, CategoryController.deleteCategory);
router.post('/category', Authenticator.staffOnly, CategoryController.createCategory);

//Customer
router.get('/customer/:id', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveCustomer);
router.get('/customers', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveAllCustomers);
router.put('/customer/changePassword', Authenticator.customerOnly, CustomerController.changePassword);
router.put('/customer/:id/toggleDisable', Authenticator.staffOnly, CustomerController.toggleDisableCustomer);
router.put('/customer/:id/activate',  Authenticator.customerOnly, CustomerController.activateCustomer);
router.put('/customer/referral', Authenticator.customerOnly, CustomerController.addReferrer);
router.put('/customer/:id', Authenticator.customerOnly, CustomerController.updateCustomer);
router.post('/customer/login', CustomerController.loginCustomer);
router.post('/customer/email', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveCustomerByEmail);
router.post('/customer/mobileNumber', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveCustomerByMobileNumber);
router.post('/customer/:id/verifyPassword', Authenticator.customerOnly, CustomerController.verifyCurrentPassword);
router.post('/customer/forgotPassword', CustomerController.sendResetPasswordEmail);
router.post('/customer/resetPassword/checkValidToken', CustomerController.checkValidToken);
router.post('/customer/resetPassword', CustomerController.resetPassword);
router.post('/customer/sendOtp', CustomerController.sendOtp);
router.post('/customer/verifyOtp', CustomerController.verifyOtp);
router.post('/customer', CustomerController.registerCustomer);

//Kiosk
router.get('/kiosks', Authenticator.customerAndMerchantAndStaffOnly, KioskController.retrieveAllKiosks);
router.get('/kiosk/:id', Authenticator.customerAndMerchantAndStaffOnly, KioskController.retrieveKiosk);
router.put('/kiosk/:id/toggleDisable', Authenticator.staffOnly, KioskController.toggleDisableKiosk);
router.put('/kiosk/:id', Authenticator.staffOnly, KioskController.updateKiosk);
router.put('/deleteKiosk/:id', Authenticator.staffOnly, KioskController.deleteKiosk);
router.post('/kiosk', Authenticator.staffOnly, KioskController.createKiosk);

//Locker
router.get('/locker/lockerType/:lockerTypeId', Authenticator.customerAndMerchantAndStaffOnly, LockerController.retrieveLockersByLockerType);
router.get('/locker/kiosk/:kioskId', Authenticator.customerAndMerchantAndStaffOnly, LockerController.retrieveLockersByKiosk);
router.get('/locker/:id', Authenticator.customerAndMerchantAndStaffOnly, LockerController.retrieveLocker);
router.get('/lockers', Authenticator.customerAndMerchantAndStaffOnly, LockerController.retrieveAllLockers);
router.put('/locker/setEmpty/:id', Authenticator.customerAndMerchantAndStaffOnly, LockerController.setLockerEmpty);
router.put('/locker/setInUse/:id', Authenticator.customerAndMerchantAndStaffOnly, LockerController.setLockerInUse);
router.put('/locker/toggleDisable/:id', Authenticator.staffOnly, LockerController.toggleDisableLocker);
router.put('/deleteLocker/:id', Authenticator.staffOnly, LockerController.deleteLocker);
router.post('/locker', Authenticator.staffOnly, LockerController.createLocker);
router.post('/openLocker', LockerController.scanOpenLocker);

//Locker Action Record
router.get('/lockerActionRecords', Authenticator.staffOnly, lockerActionRecordController.retrieveAllLockerActions);
router.get('/lockerActions/:lockerId',Authenticator.staffOnly, lockerActionRecordController.retrieveLockerActionsByLockerId);

//Locker Type
router.get('/lockerType/kiosk/:kioskId', Authenticator.customerAndMerchantAndStaffOnly, LockerTypeController.retrieveLockerTypesByKiosk);
router.get('/lockerType/:id', Authenticator.customerAndMerchantAndStaffOnly, LockerTypeController.retrieveLockerType);
router.get('/lockerTypes', Authenticator.customerAndMerchantAndStaffOnly, LockerTypeController.retrieveAllLockerTypes);
router.put('/lockerType/toggleDisable/:id', Authenticator.staffOnly, LockerTypeController.toggleDisableLockerType);
router.put('/lockerType/:id', Authenticator.staffOnly, LockerTypeController.updateLockerType);
router.put('/deleteLockerType/:id', Authenticator.staffOnly, LockerTypeController.deleteLockerType);
router.post('/lockerType', Authenticator.staffOnly, LockerTypeController.createLockerType);

//Maintenance Action
router.get('/maintenanceAction/:id', Authenticator.staffOnly, MaintenanceActionController.retrieveMaintenanceAction);
router.get('/maintenanceActions', Authenticator.staffOnly, MaintenanceActionController.retrieveAllMaintenanceAction);
router.put('/maintenanceAction/:id', Authenticator.staffOnly, MaintenanceActionController.updateMaintenanceAction);
router.put('/deleteMaintenanceAction/:id', Authenticator.staffOnly, MaintenanceActionController.deleteMaintenanceAction);
router.post('/maintenanceAction', Authenticator.staffOnly, MaintenanceActionController.createMaintenanceAction);

//Merchant
router.get('/merchant/productVariation/:productVariationId', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveMerchantByProductVariationId);
router.get('/merchant/promotion/:promotionId', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveMerchantByPromotionId);
router.get('/merchant/:id', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveMerchant);
router.get('/merchants', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveAllMerchants);
router.put('/merchant/:id/toggleDisable', Authenticator.staffOnly, MerchantController.toggleDisableMerchant);
router.put('/merchant/:id/approve', Authenticator.staffAdminOnly, MerchantController.approveMerchant);
router.put('/merchant/:id/changePassword', Authenticator.merchantOnly, MerchantController.changePassword);
router.put('/merchant/:id', Authenticator.merchantOnly, MerchantController.updateMerchant);
router.post('/merchant/login', MerchantController.loginMerchant);
router.post('/merchant/email', MerchantController.retrieveMerchantByEmail);
router.post('/merchant/forgotPassword', MerchantController.sendResetPasswordEmail);
router.post('/merchant/resetPassword/checkValidToken', MerchantController.checkValidToken);
router.post('/merchant/resetPassword', MerchantController.resetPassword);
router.post('/merchant', MerchantController.registerMerchant);
router.post('/merchant/:id/uploadTenancyAgreement', Upload.preUploadCheck, MerchantController.uploadTenancyAgreement);
router.post('/merchantUploadLogoPreRegistration', Upload.preUploadCheckForImg, MerchantController.uploadImageForMerchantLogoPreRegister);
router.post('/merchantUploadLogo/:id', Upload.preUploadCheckForImg, MerchantController.addImageForMerchantLogo);
router.post('/merchantChangeLogo/:id', Upload.preUploadCheckForImg, MerchantController.changeImageForMerchantLogo);
router.post('/merchantRemoveLogo/:id', MerchantController.removeImageForMerchantLogo);

//Notification
router.get('/notification/customer/:customerId', Authenticator.customerOnly, NotificationController.retrieveAllNotificationByCustomerId);
router.get('/notification/merchant/:merchantId', Authenticator.merchantOnly, NotificationController.retrieveAllNotificationByMerchantId);
router.get('/notification/staff', Authenticator.staffOnly, NotificationController.retrieveStaffNotification);
router.put('/readNotification/:id', Authenticator.customerAndMerchantAndStaffOnly, NotificationController.readNotification);
router.post('/notification/create', Authenticator.staffOnly, NotificationController.createNotification);

//Order
router.get('/order/orderStatus', Authenticator.customerAndMerchantAndStaffOnly, OrderController.retrieveAllOrderStatus);
router.get('/orders/customer/:customerId', Authenticator.customerAndMerchantAndStaffOnly, OrderController.retrieveOrderByCustomerId);
router.get('/orders/merchant/:merchantId', Authenticator.merchantAndStaffOnly, OrderController.retrieveOrderByMerchantId);
router.get('/orders', Authenticator.staffOnly, OrderController.retrieveAllOrders);
router.get('/order/:id', Authenticator.customerAndMerchantAndStaffOnly, OrderController.retrieveOrderById);
router.put('/order/:id', Authenticator.customerAndMerchantAndStaffOnly, OrderController.updateOrderStatus);
router.post('/order', Authenticator.customerOnly, OrderController.createOrder);

//Payment
router.get('/pay/:customerId/:amount', Authenticator.customerAndMerchantOnly, PaymentController.pay);
router.get('/success', PaymentController.success);
router.get('/cancel', PaymentController.cancel);

//Product
router.get('/product/:id', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveProduct);
router.get('/products/popular/:quantity', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveMostPopularProducts);
router.get('/products/recent/:quantity', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveMostRecentProducts);
router.get('/products', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveAllProduct);
router.get('/merchantProducts/:merchantId', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveProductByMerchantId);
router.get('/categoryProducts/:categoryId', Authenticator.customerAndMerchantAndStaffOnly, ProductController.retrieveProductByCategoryId);
router.put('/deleteProduct/:id', Authenticator.merchantAndStaffOnly, ProductController.deleteProduct);
router.put('/product/toggleDisable/:id', Authenticator.merchantAndStaffOnly, ProductController.toggleDisableProduct);
router.put('/product/:id', Authenticator.merchantOnly, ProductController.updateProduct);
router.post('/product/search', Authenticator.customerAndMerchantAndStaffOnly, ProductController.searchProducts);
router.post('/product/addImage', Authenticator.merchantOnly, Upload.preUploadCheckForImg, ProductController.addImageForProduct);
router.post('/product', Authenticator.merchantOnly, ProductController.createProduct);


//Product Variation
router.get('/productVariations/:id', Authenticator.customerAndMerchantAndStaffOnly, ProductVariationController.retrieveProductVariationsByProductId);
router.get('/productVariationsIncludingDisabled/:id', Authenticator.customerAndMerchantAndStaffOnly,  ProductVariationController.retrieveProductVariationsByProductIdIncludingDisabled);
router.put('/productVariations/toggleDisable/:id', Authenticator.customerAndMerchantAndStaffOnly, ProductVariationController.toggleDisableProductVariation);
router.put('/productVariations/:id', Authenticator.customerAndMerchantAndStaffOnly, ProductVariationController.updateProductVariation);
router.put('/deleteProductVariations/:id', Authenticator.customerAndMerchantAndStaffOnly, ProductVariationController.deleteProductVariation);
router.post('/productVariation/addImage', Authenticator.merchantOnly, Upload.preUploadCheckForImg, ProductVariationController.addImageForProductVariation);
router.post('/productVariation', Authenticator.merchantOnly, ProductVariationController.createProductVariation);

//Promotion
router.get('/promotion/mall', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrieveAllMallPromotions);
router.get('/promotion/merchant', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrieveAllMerchantPromotions);
router.get('/promotion/merchant/:id', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrieveMerchantPromotionByMerchantId);
router.get('/promotion/promoCode/:promoCode', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrievePromotionByPromoCode);
router.get('/promotions', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrieveAllPromotions);
router.get('/promotion/:id', Authenticator.customerAndMerchantAndStaffOnly, PromotionController.retrievePromotionById);
router.put('/promotion/:id', Authenticator.merchantAndStaffOnly, PromotionController.updatePromotion);
router.put('/deletePromotion/:id', Authenticator.merchantAndStaffOnly, PromotionController.deletePromotion);
router.post('/promotion/merchant', Authenticator.merchantOnly, PromotionController.createMerchantPromotion);
router.post('/promotion/mall', Authenticator.staffOnly, PromotionController.createMallPromotion);

//Staff
router.get('/staff/staffRoles', Authenticator.staffOnly, StaffController.retrieveStaffRoles);
router.get('/staff/:id', Authenticator.staffOnly, StaffController.retrieveStaff);
router.get('/staff', Authenticator.staffAdminOnly, StaffController.retrieveAllStaff);
router.put('/staff/staffRole/:id', Authenticator.staffAdminOnly, StaffController.updateStaffRole);
router.put('/staff/:id/changePassword', Authenticator.staffOnly, StaffController.changePassword);
router.put('/staff/:id', Authenticator.staffOnly, StaffController.updateStaff);
router.put('/staff/:id/toggleDisable', Authenticator.staffAdminOnly, StaffController.toggleDisableStaff);
router.post('/staff/login', StaffController.loginStaff);
router.post('/staff/email', Authenticator.staffOnly, StaffController.retrieveStaffByEmail);
router.post('/staff/forgotPassword', StaffController.sendResetPasswordEmail);
router.post('/staff/resetPassword/checkValidToken', StaffController.checkValidToken);
router.post('/staff/resetPassword', StaffController.resetPassword);
router.post('/staff', Authenticator.staffAdminOnly, StaffController.registerStaff);

module.exports = router;
