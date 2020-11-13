module.exports = {
  AccountType: {
    CUSTOMER: 'Customer',
    MERCHANT: 'Merchant',
    STAFF: 'Staff'
  },
  BookingStatus: {
    UNFULFILLED: 'Unfulfilled',
    ACTIVE: 'Active',
    FULFILLED: 'Fulfilled',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired'
  },
  BookingSource: {
    MOBILE: 'Mobile',
    KIOSK: 'Kiosk'
  },
  CollectionMethod: {
    IN_STORE: 'In Store',
    KIOSK: 'Kiosk'
  },
  CreditPaymentType: {
    ORDER: 'Order',
    BOOKING: 'Booking',
    BOOKING_PACKAGE: 'Booking Package',
    BOOKING_OVERTIME_CHARGE: 'Booking Overtime Charge',
    REFERRAL_BONUS: 'Referral Bonus'
  },
  LockerStatus: {
    IN_USE: 'In Use',
    EMPTY: 'Empty'
  },
  LockerAction: {
    CLOSE: 'Close',
    OPEN: 'Open'
  },
  ModelEnum: {
    MERCHANT: 'Merchant',
    BOOKING: 'Booking',
    ORDER: 'Order',
    STAFF: 'Staff',
    CUSTOMER: 'Customer',
    ADVERTISEMENT: 'Advertisement'
  },
  OrderStatus: {
    PENDING_PAYMENT: 'Pending Payment',
    PROCESSING: 'Processing',
    READY_FOR_COLLECTION: 'Ready For Collection',
    COMPLETE: 'Complete',
    CANCELLED: 'Cancelled',
    REFUND: 'Refund'
  },
  PaymentStatus: {
    CANCELLED: 'Cancelled',
    PAID: 'Paid'
  },
  PaymentType: {
    CASH: 'Cash',
    CREDIT_CARD: 'Credit Card',
    PAYLAH: 'Paylah',
    PAYNOW: 'Paynow',
    PAYPAL: 'Paypal'
  },
  PromotionType: {
    MALL_PROMOTION: 'Mall Promotion',
    MERCHANT_PROMOTION: 'Merchant Promotion'
  },
  StaffRole: {
    ADMIN: 'Admin',
    EMPLOYEE: 'Employee'
  },
  Error: {
    AdvertisementOngoingCannotMarkExpire: 'Cannot mark an ongoing advertisement as expired',
    AdvertisementApprovedCannotMarkExpire : 'Cannot mark expire an advertisement waiting to be advertised',
    AdvertisementDeleted: 'Advertisement is deleted',
    AdvertisementDisapproveError: 'Cannot disapprove an ongoing advertisement',
    AdvertisementExpired: 'Advertisement has expired',
    AdvertisementEndDateRequired: 'Advertisement end date is required',
    AdvertisementNotFound: 'Advertisement not found',
    AdvertisementStartDateRequired: 'Advertisement start date is required',
    AdvertisementTitleRequired: 'Advertisement title is required',
    AdvertiserEmailRequired: 'Advertiser email required',
    AdvertiserMobileRequired: 'Advertiser mobile required',
    AmountRequired: 'Amount is required',
    AnnouncementNotFound: 'Announcement not found',
    AnnouncementCannotBeDeleted: 'Announcement cannot be deleted',
    AnnouncementDeleted: 'Announcement is deleted',
    AnnouncementTimeInvalid: 'Announcement sent time should be in the future',
    AccessDenied: 'Access denied',
    BookingPackageModelAlreadyUsed: 'Booking package model has already been used and cannot be deleted',
    BookingPackageModelAlreadyPublished: 'Booking package model has already been published',
    BookingPackageModelCannotBeDisabled: 'Published booking package model cannot be disabled',
    BookingPackageModelCannotBeDeleted: 'Booking package model cannot be deleted',
    BookingPackageModelDeleted: 'Booking package model is deleted',
    BookingPackageModelIsDisabled: 'Booking package model is disabled',
    BookingPackageModelNotFound: 'Booking package model not found',
    BookingPackageNotFound: 'Booking package not found',
    BookingPackageCannotBeSold: 'You already have an active booking package',
    BookingPackageSoldOut: 'Booking package is sold out',
    BookingPackageQuotaInsufficient: 'Booking package quota is in sufficient',
    BookingPackageReachedMaximumLockerCount: 'Booking package reached maximum locker count',
    BookingCannotBeCancelled: 'Booking cannot be cancelled',
    BookingCannotBeMade: 'No free slots during the given start time and end time',
    BookingNotFound: 'Booking not found',
    BookingStartDateAfterPackageEndDate: 'Booking start date is after the booking package\'s end date',
    CategoryCannotBeDeleted: 'Category cannot be deleted',
    CategoryDeleted: 'Category is deleted',
    CategoryNameExist: 'Category name exists',
    CategoryNameRequired: 'Category name is required',
    CategoryIdRequired: 'Category ID is required',
    CategoryNotFound: 'Category is not found',
    CheckerCalledInappropriately: 'Checker was called inappropriately',
    ChooseOneDiscountType: 'Choose only one discount type',
    CurrentPasswordRequired: 'Current password required',
    CustomerDisabled: 'Customer is disabled',
    CustomerNotActivated: 'Customer not activated',
    CustomerNotFound: 'Customer not found',
    CustomerNotFoundWithEmail: 'Customer not found with the email entered',
    DateRequired: 'Date is required',
    EmailInvalid: 'Email is invalid',
    EmailNotUnique: 'Email is not unique',
    EmailRequired: 'Email is required',
    EnumRequired: ' is Required',
    EnumDoesNotExist: ' does not exist in the Enum list',
    FileRequired: 'File is required',
    FirstNameRequired: 'First name is required',
    IdRequired: 'ID is required',
    ImageRequired: 'Image file required',
    InvalidDate: 'Invalid date',
    InvalidQrCode: 'Invalid QR Code',
    InsufficientCreditBalance: 'Insufficient credit balance',
    KioskCannotBeDeleted: 'Kiosk cannot be deleted',
    KioskDeleted: 'Kiosk is deleted',
    KioskDisabled: 'Kiosk is disabled',
    KioskAddressRequired: 'Kiosk address is required',
    KioskNotFound: 'Kiosk not found',
    LastNameRequired: 'Last name is required',
    LockerCannotBeDeleted: 'Locker cannot be deleted',
    LockerDeleted: 'Locker is deleted',
    LockerTypeDeleted: 'Locker type is deleted',
    LockerTypeDifferent: 'Locker type is different from that of the existing booking package',
    LockerTypeNotFound: 'Locker type not found',
    LockerNotFound: 'Locker is not found',
    MaintenanceActionDeleted: 'Maintenance action is deleted',
    MaintenanceActionNotFound: 'Maintenance action not found',
    MerchantIdRequired: 'Merchant ID is required',
    MerchantDisabled: 'Merchant is disabled',
    MerchantNotApproved: 'Merchant is not approved',
    MerchantNotFound: 'Merchant not found',
    MobileNumberInUse: 'Mobile number is in use',
    MobileNumberNotUnique: 'Mobile number is not unique',
    MobileNumberRequired: 'Mobile number is required',
    NameNotUnique: 'Name is not unique',
    NameRequired: 'Name is required',
    NewPasswordRequired: 'New password required',
    NoActiveBookingPackage: 'No active booking package available',
    NotificationNotFound: 'Notification Not Found',
    NoLockersAvailable: 'No lockers available',
    OrderNotFound: 'Order not found',
    OtpInvalid: 'OTP is invalid',
    PasswordCannotChange: 'Password cannot be changed',
    PasswordIncorrect: 'Password is incorrect',
    PasswordRequired: 'Password is required',
    PasswordWeak: 'Password requires at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 numeric digit, and 1 special character',
    PayloadRequired: 'Payload is required',
    PaymentIdRequired: 'Payment ID required',
    PdfFileRequired: 'PDF file is required',
    PriceDoesNotTally: 'Price passed in does not tally with the price calculated',
    ProductCannotBeDeleted: 'Product cannot be deleted',
    ProductDeleted: 'Product is deleted',
    ProductIdOrProductVariationIdRequired: 'Product ID or product variation ID required',
    ProductNotFound: 'Product not found',
    ProductVariationCannotBeDeleted: 'Product variation cannot be deleted',
    ProductVariationDeleted: 'Product variation is deleted',
    ProductVariationDisabled: 'Product variation is disabled',
    ProductVariationNotFound: 'Product variation not found',
    PromotionCannotBeDeleted: 'Promotion cannot be deleted since its already used',
    PromotionExpired: 'Promotion is expired',
    PromotionMinimumSpendNotMet: 'Promotion minimum spend not met',
    PromotionUsageLimitReached: 'Promotion usage limit reached',
    PromoCodeNotUnique: 'Promotion code not unique',
    PromotionDeleted: 'Promotion is deleted',
    PromotionNotFound: 'Promotion not found',
    QuantityAvailableRequired: 'Quantity available is required',
    QuantityRequired: 'Quantity is required',
    ReferrerExist: 'Referrer already exists',
    ReferrerAndRefereeInvalid: 'Referrer and referee cannot have the same ID',
    StaffDisabled: 'Staff is disabled',
    StaffNotFound: 'Staff not found',
    StartDateLaterThanEndDate: 'Start date should not be later then end date',
    StaffRoleRequired: 'Staff role is required',
    TenancyAgreementRequired: 'Tenancy agreement is required',
    TitleRequired: 'Title is required',
    TimeCannotExceed24H: 'Booking time cannot exceed 24h',
    TokenExpired: 'Token is expired',
    TokenRequired: 'Token is required',
    TokenNotFound: 'Token not found',
    UnexpectedError: 'An unexpected error has occured',
    UnitPriceRequired: 'Unit Price is required',
    UsageLimitLowerThanUsageCount: 'Usage limit is lower than current usage count',
    UserUnauthorised: 'User is unauthorised',
    XXXCannotBeNegative: 'must be more than zero',
    XXXIsRequired:'is required',
    XXXMustBeNumber: 'must be a number',
  }
};
