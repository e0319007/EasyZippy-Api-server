const Advertisement = require('./app/models/Advertisement');
const Announcement = require('./app/models/Announcement');
const Booking = require('./app/models/Booking');
const BookingPackage = require('./app/models/BookingPackage');
const BookingPackageModel = require('./app/models/BookingPackageModel');
const Cart = require('./app/models/Cart');
const Category = require('./app/models/Category');
const Customer = require('./app/models/Customer');
const Kiosk = require('./app/models/Kiosk');
const LineItem = require('./app/models/LineItem');
const Locker = require('./app/models/Locker');
const LockerActionRecord = require('./app/models/LockerActionRecord');
const LockerType = require('./app/models/LockerType');
const MaintenanceAction = require('./app/models/MaintenanceAction');
const Merchant = require('./app/models/Merchant');
const Notification = require('./app/models/Notification');
const Order = require('./app/models/Order');
const CreditRecord = require('./app/models/CreditRecord');
const Product = require('./app/models/Product');
const Promotion = require('./app/models/Promotion');
const Staff = require('./app/models/Staff');

const sequelize = require('./app/common/database');

const initialiseDatabase = async () => {
  await sequelize.drop()
    .then(async () => {
      return sequelize.sync({ force: true });
    })
    .catch((error) => {
      console.log(`Error in initialising database: ${error}`);
    });
  
  await sequelize.close();
};

initialiseDatabase();
console.log('Database initialised');