const Advertisement = require('./app/models/Advertisement');
const BookingPackage = require('./app/models/BookingPackage');
const BookingPackageModel = require('./app/models/BookingPackageModel');
const Kiosk = require('./app/models/Kiosk');
const Locker = require('./app/models/Locker');
const LockerActionRecord = require('./app/models/LockerActionRecord');
const LockerType = require('./app/models/LockerType');
const MaintenanceAction = require('./app/models/MaintenanceAction');
const Staff = require('./app/models/Staff');
const sequelize = require('./app/common/database');

const initialiseDatabase = async () => {
  await sequelize.drop()
    .then(async (modelsDropped) => {
      console.log('Models Dropped: ');
      console.log(modelsDropped);
      return sequelize.sync({ force: true });
    })
    .catch((error) => {
      console.log(`Error in initialising database: ${error}`);
    });
  
  await sequelize.close();
};

initialiseDatabase();
console.log('Database initialised');