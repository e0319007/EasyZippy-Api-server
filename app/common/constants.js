module.exports = {
  AccountType: {
    Customer: 'Customer',
    Merchant: 'Merchant',
    Staff: 'Staff'
  },
  BookingStatus: {
    Unfulfilled: 'Unfulfilled',
    Active: 'Active',
    Fulfilled: 'Fulfilled',
    Cancelled: 'Cancelled',
    Expired: 'Expired'
  },
  BookingSource: {
    Mobile: 'Mobile',
    Kiosk: 'Kiosk'
  },
  CollectionMethod: {
    InStall: 'In Stall',
    Kiosk: 'Kiosk'
  },
  CreditPaymentType: {
    Order: 'Order',
    Booking: 'Booking',
    BookingPackage: 'Booking Package',
    BookingOvertimeCharge: 'Booking Overtime Charge',
    ReferralBonus: 'Referral Bonus'
  },
  LockerStatus: {
    InUse: 'In Use',
    Empty: 'Empty'
  },
  LockerAction: {
    Close: 'Close',
    Open: 'Open'
  },
  ModelEnum: {
    Merchant: 'Merchant',
    Booking: 'Booking',
    Order: 'Order',
    Staff: 'Staff',
    Customer: 'Customer'
  },
  OrderStatus: {
    PendingPayment: 'Pending Payment',
    Processing: 'Processing',
    ReadyForCollection: 'Ready For Collection',
    Complete: 'Complete',
    Cancelled: 'Cancelled',
    Refund: 'Refund'
  },
  PaymentStatus: {
    Cancelled: 'Cancelled',
    Paid: 'Paid'
  },
  PaymentType: {
    Cash: 'Cash',
    CreditCard: 'Credit Card',
    Paylah: 'Paylah',
    Paynow: 'Paynow',
    Paypal: 'Paypal'
  },
  PromotionType: {
    MallPromotion: 'Mall Promotion',
    MerchantPromotion: 'Merchant Promotion'
  },
  StaffRole: {
    Admin: 'Admin',
    Employee: 'Employee'
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
    InsufficientCreditBalance: 'Insufficient credit balance',
    KioskDeleted: 'Kiosk is deleted',
    KioskDisabled: 'Kiosk is disabled',
    KioskAddressRequired: 'Kiosk address is required',
    KioskNotFound: 'Kiosk not found',
    LastNameRequired: 'Last name is required',
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
    ProductDeleted: 'Product is deleted',
    ProductIdOrProductVariationIdRequired: 'Product ID or product variation ID required',
    ProductNotFound: 'Product not found',
    ProductVariationDeleted: 'Product variation is deleted',
    ProductVariationNotFound: 'Product variation not found',
    PromotionCannotBeDeleted: 'Promotion cannot be deleted since its already used',
    PromotionMinimumSpendNotMet: 'Promotion minimum spend not met',
    PromotionUsageLimitReached: 'Promotion usage limit reached',
    PromoCodeNotUnique: 'Promotion code not unique',
    PromotionDeleted: 'Promotion is deleted',
    PromotionNotFound: 'Promotion not found',
    QuantityAvailableRequired: 'Quantity available is required',
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
