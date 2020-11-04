const sequelize = require('../app/common/database');
const InitDb = require('../initDb');
const Helper = require('../app/common/helper');
const Staff = require('../app/models/Staff');
const TestClient = require('./testClient');
const Constants = require('../app/common/constants');

describe('Staff Function Test', () => {
  let token;

  beforeEach(async (done) => {
    const hashedPassword = await Helper.hashPassword('Password123!');
    await Staff.create({ id: 1, firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: hashedPassword, email: 'alice@email.com', staffRoleEnum: Constants.StaffRole.Admin });
    token = (await TestClient.loginStaff({ email: 'alice@email.com', password: 'Password123!' })).body.token;
    done();
  });

  it(`test`, async (done) => {
    expect(true).toEqual(true);
    
    done();
  });

  // it(`Retrieve staff roles`, async (done) => {
  //   expect(true).toEqual(true);
  //   const res =  await TestClient.retrieveStaffRoles(token);

  //   expect(res.status).toEqual(200);
  //   expect(res.body.length).toEqual(2);

  //   done();
  // });

  // it.except(`Retrieve staff roles`, async (done) => {
  //   expect(true).toEqual(true);
  //   const res =  await TestClient.retrieveStaffRoles(token);

  //   expect(res.status).toEqual(200);
  //   expect(res.body.length).toEqual(2);

  //   done();
  // });

  // afterEach(async (done) => {
  //   console.log('after')
    
  //   await sequelize.truncate();
  //   done();
  // });
});