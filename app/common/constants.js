module.exports = {
  AccountType: {
    Customer: 'Customer',
    Merchant: 'Merchant',
    Staff: 'Staff'
  },
  BookingStatus: {
    Unfufilled: 'Unfufilled',
    Active: 'Active',
    Fufilled: 'Fufilled',
    Cancelled: 'Cancelled'
  },
  BookingSource: {
    Mobile: 'Mobile',
    Kiosk: 'Kiosk'
  },
  CollectionMethod: {
    InStall: 'In Stall',
    Kiosk: 'Kiosk'
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
    BookingNotFound: 'Booking not found',
    CategoryDeleted: 'Category is deleted',
    CategoryNameExist: 'Category name exists',
    CategoryNameRequired: 'Category name is required',
    CategoryIdRequired: 'Category ID is required',
    CategoryNotFound: 'Category is not found',
    CheckerCalledInappropriately: 'Checker was called inappropriately',
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
    InsufficientCreditBalance: 'Insufficient credit balance',
    KioskDeleted: 'Kiosk is deleted',
    KioskDisabled: 'Kiosk is disabled',
    KioskAddressRequired: 'Kiosk address is required',
    KioskNotFound: 'Kiosk not found',
    LastNameRequired: 'Last name is required',
    LockerDeleted: 'Locker is deleted',
    LockerTypeDeleted: 'Locker type is deleted',
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
    NotificationNotFound: 'NotificationNotFound',
    OrderNotFound: 'Order not found',
    OtpInvalid: 'OTP is invalid',
    PasswordCannotChange: 'Password cannot be changed',
    PasswordIncorrect: 'Password is incorrect',
    PasswordRequired: 'Password is required',
    PasswordWeak: 'Password requires at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 numeric digit, and 1 special character',
    PayloadRequired: 'Payload is required',
    PaymentIdRequired: 'Payment ID required',
    PdfFileRequired: 'PDF file is required',
    ProductDeleted: 'Product is deleted',
    ProductNotFound: 'Product not found',
    PromotionCannotBeDeleted: 'Promotion cannot be deleted since its already used',
    PromotionNotFound: 'Promotion not found',
    QuantityAvailableRequired: 'Quantity available is required',
    StaffDisabled: 'Staff is disabled',
    StaffNotFound: 'Staff not found',
    StartDateLaterThanEndDate: 'Start date should not be later then end date',
    StaffRoleRequired: 'Staff role is required',
    TenancyAgreementRequired: 'Tenancy agreement is required',
    TitleRequired: 'Title is required',
    TokenExpired: 'Token is expired',
    TokenRequired: 'Token is required',
    TokenNotFound: 'Token not found',
    UnexpectedError: 'An unexpected error has occured',
    UnitPriceRequired: 'Unit Price is required',
    UserUnauthorised: 'User is unauthorised',
    XXXCannotBeNegative: 'must be more than zero',
    XXXIsRequired:'is required',
    XXXMustBeNumber: 'must be a number',
  }
};
