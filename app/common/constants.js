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
  Error: {
    AdvertisementExpired: 'Advertisement has expired',
    AdvertisementEndDateRequired: 'Advertisement end date is required',
    AdvertisementNotFound: 'Advertisement not found',
    AdvertisementStartDateRequired: 'Advertisement start date is required',
    AdvertisementTitleRequired: 'Advertisement title is required',
    AdvertiserEmailRequired: 'Advertiser email required',
    AdvertiserMobileRequired: 'Advertiser mobile required',
    CategoryNameExist: 'Category name exists',
    CategoryNameRequired: 'Category name is required',
    CategoryNotFound: 'Category is not found',
    CustomerDisabled: 'Customer is disabled',
    CustomerNotActivated: 'Customer not activated',
    CustomerNotFound: 'Customer not found',
    EmailInvalid: 'Email is invalid',
    EmailNotUnique: 'Email is not unique',
    EmailRequired: 'Email is required',
    KioskDisabled: 'Kiosk is disabled',
    KioskLocationRequired: 'Kiosk location is required',
    KioskNotFound: 'Kiosk not found',
    FirstNameRequired: 'First name is required',
    IdRequired: 'ID is required',
    LastNameRequired: 'Last name is required',
    MerchantDisabled: 'Merchant is disabled',
    MerchantNotApproved: 'Merchant is not approved',
    MerchantNotFound: 'Merchant not found',
    MobileNumberNotUnique: 'Mobile number is not unique',
    MobileNumberRequired: 'Mobile number is required',
    NameRequired: 'Name is required',
    PasswordIncorrect: 'Password is incorrect',
    PasswordRequired: 'Password is required',
    StaffDisabled: 'Staff is disabled',
    StaffNotFound: 'Staff not found',
    StartDateLaterThanEndDate: 'Start date should not be later then end date',
    UnexpectedError: 'An unexpected error has occured'
  }
};