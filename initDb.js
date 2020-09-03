const Cart = require('./app/models/Cart');
const Category = require('./app/models/Category');
const LineItem = require('./app/models/LineItem');
const Notification = require('./app/models/Notification');
const PaymentRecord = require('./app/models/PaymentRecord');
const Product = require('./app/models/Product');
const Promotion = require('./app/models/Promotion');
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