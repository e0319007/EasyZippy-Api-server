const sequelize = require('../app/common/database');
const Customer = require('../app/models/Customer');

describe('Sample Test Desc', () => {
  beforeAll(async (done) => {
    await sequelize.truncate({ cascade: true });
    
    done();
  });

  it('Sample Case', async (done) => {
    await Customer.create({ firstName: 'Customer', lastName: 'One', mobileNumber: '91234567', password: 'password', salt: 'salt', email: 'email' });
    
    expect(true).toEqual(true);
    
    done();
  });

  afterAll(async (done) => {
    await sequelize.truncate({ cascade: true });

    await sequelize.close();

    done();
  });
});