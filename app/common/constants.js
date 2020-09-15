module.exports = {
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
    CategoryNameExist: 'Category name not unique',
    CategoryNameRequired: 'Category name is required',
    CategoryNotFound: 'Category not found',
    CustomerNotFound: 'Customer not found',
    EmailInvalid: 'Email is invalid',
    EmailNotUnique: 'Email is not unique',
    EmailRequired: 'Email is required',
    KioskLocationRequired: 'Kiosk location is required',
    KioskNotFound: 'Kiosk not found',
    FirstNameRequired: 'First name is required',
    IdRequired: 'ID is required',
    LastNameRequired: 'Last name is required',
    MerchantNotFound: 'Merchant not found',
    MobileNumberNotUnique: 'Mobile number is not unique',
    MobileNumberRequired: 'Mobile number is required',
    NameRequired: 'Name is required',
    PasswordRequired: 'Password is required',
    StaffNotFound: 'Staff not found',
    UnexpectedError: 'An unexpected error has occured'
  }
};