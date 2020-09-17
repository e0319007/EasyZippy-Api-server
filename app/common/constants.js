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
    CategoryNotFound: 'Category is not found',
    CurrentPasswordRequired: 'Current password required',
    CustomerDisabled: 'Customer is disabled',
    CustomerNotActivated: 'Customer not activated',
    CustomerNotFound: 'Customer not found',
    EmailInvalid: 'Email is invalid',
    EmailNotUnique: 'Email is not unique',
    EmailRequired: 'Email is required',
    FileRequired: 'File is required',
    FirstNameRequired: 'First name is required',
    IdRequired: 'ID is required',
    ImageFileRequired: 'Image file is required',
    KioskDisabled: 'Kiosk is disabled',
    KioskLocationRequired: 'Kiosk location is required',
    KioskNotFound: 'Kiosk not found',
    LastNameRequired: 'Last name is required',
    MerchantDisabled: 'Merchant is disabled',
    MerchantNotApproved: 'Merchant is not approved',
    MerchantNotFound: 'Merchant not found',
    MobileNumberNotUnique: 'Mobile number is not unique',
    MobileNumberRequired: 'Mobile number is required',
    NameNotUnique: 'Name is not unique',
    NameRequired: 'Name is required',
    NewPasswordRequired: 'New password required',
    PasswordCannotChange: 'Password cannot be changed',
    PasswordIncorrect: 'Password is incorrect',
    PasswordRequired: 'Password is required',
    PasswordWeak: 'Password requires at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 numeric digit, and 1 special character',
    StaffDisabled: 'Staff is disabled',
    StaffNotFound: 'Staff not found',
    TenancyAgreementRequired: 'Tenancy agreement is required',
    UnexpectedError: 'An unexpected error has occured'
  }
};