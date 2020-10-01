module.exports = {
  AccountType: {
    Customer: 'Customer',
    Merchant: 'Merchant',
    Staff: 'Staff'
  },
  PaymentStatus: {
    Cancelled: 'Cancelled',
    Paid: 'Paid'
  },
  PaymentType: {
    Cash: 'Cash',
    CreditCard: 'Credit Card',
    Paylah: 'Paylah',
    Paynow: 'Paynow'
  },
  StaffRole: {
    Admin: 'Admin',
    Employee: 'Employee'
  },
  OrderStatus: {
    PendingPayment: 'Pending Payment',
    Processing: 'Processing',
    ReadyForCollection: 'Ready For Collection',
    Cancelled: 'Cancelled',
    Refund: 'Refund'
  },
  BookingStatus: {
    Unfufilled: 'Unfufilled',
    Active: 'Active',
    Fufilled: 'Fufilled',
    Cancelled: 'Cancelled'
  },
  LockerStatus: {
    InUse: 'In Use',
    Empty: 'Empty',
    Disabled: 'Disabled'
  },
  LockerAction: {
    Close: 'Close',
    Open: 'Open'
  },
  BookingSource: {
    Mobile: 'Mobile',
    Kiosk: 'Kiosk'
  },
  PromotionType: {
    MallPromotion: 'Mall Promotion',
    MerchantPromotion: 'Merchant Promotion'
  },
  Error: {
    AdvertisementOngoingCannotMarkExpire: 'Cannot mark an ongoing advertisement as expired',
    AdvertisementApprovedCannotMarkExpire : 'Cannot mark expire an advertisement waiting to be advertised',
    AdvertisementApprovedCannotDelete : 'Cannot delete an approved advertisement',
    AdvertisementDisapproveError: 'Cannot disapprove an ongoing advertisement',
    AdvertisementExpired: 'Advertisement has expired',
    AdvertisementEndDateRequired: 'Advertisement end date is required',
    AdvertisementNotFound: 'Advertisement not found',
    AdvertisementStartDateRequired: 'Advertisement start date is required',
    AdvertisementTitleRequired: 'Advertisement title is required',
    AdvertiserEmailRequired: 'Advertiser email required',
    AdvertiserMobileRequired: 'Advertiser mobile required',
    AnnouncementNotFound: 'Announcement not found',
    AnnouncementCannotBeDeleted: 'Announcement cannot be deleted',
    AnnouncementTimeInvalid: 'Announcement sent time should be in the future',
    AccessDenied: 'Access denied',
    CannotBeNegative: 'must be more than zero',
    CategoryNameExist: 'Category name exists',
    CategoryNameRequired: 'Category name is required',
    CategoryIdRequired: 'Category ID is required',
    CategoryNotFound: 'Category is not found',
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
    KioskDisabled: 'Kiosk is disabled',
    KioskAddressRequired: 'Kiosk address is required',
    KioskNotFound: 'Kiosk not found',
    LastNameRequired: 'Last name is required',
    LockerNotFound: 'Locker is not found',
    MaintenanceActionNotFound: 'Maintenance action not found',
    MerchantIdRequired: 'Merchant ID is required',
    MerchantDisabled: 'Merchant is disabled',
    MerchantNotApproved: 'Merchant is not approved',
    MerchantNotFound: 'Merchant not found',
    MobileNumberInUse: 'Mobile number is in use',
    MobileNumberNotUnique: 'Mobile number is not unique',
    MobileNumberRequired: 'Mobile number is required',
    MustBeNumber: 'must be a number',
    NameNotUnique: 'Name is not unique',
    NameRequired: 'Name is required',
    NewPasswordRequired: 'New password required',
    NotificationNotFound: 'NotificationNotFound',
    OtpInvalid: 'OTP is invalid',
    PasswordCannotChange: 'Password cannot be changed',
    PasswordIncorrect: 'Password is incorrect',
    PasswordRequired: 'Password is required',
    PasswordWeak: 'Password requires at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 numeric digit, and 1 special character',
    PdfFileRequired: 'PDF file is required',
    ProductDisableError: 'Only archived products can be disabled',
    ProductNotFound: 'Product not found',
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
    UserUnauthorised: 'User is unauthorised'
  }
};