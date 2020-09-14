const sequelize = require('../app/common/database');
const TestClient = require('./testClient');
const Constants = require('../app/common/constants');

const Staff = require('../app/models/Staff');

describe('Staff Operations', () => {
  let res;

  beforeAll(async (done) => {
    await sequelize.truncate({ cascade: true });
    await Staff.bulkCreate(
      { id: 1, firstName: 'Alice', lastName: 'Ang', mobileNumber: '91234567', password: 'password', email: 'alice@email.com' },
      { id: 2, firstName: 'Ben', lastName: 'Bong', mobileNumber: '92345678', password: 'password', email: 'ben@email.com' }
    );
    
    done();
  });

  it.only('A Staff instance will be successfully retrieved with a valid staff ID', async (done) => {
    res = await TestClient.retrieveStaff(1);

    expect(res.status).toEqual(200);
    expect(res.body.firstName).toEqual('Alice');
    expect(res.body.lastName).toEqual('Ang');
    expect(res.body.mobileNumber).toEqual('91234567');
    expect(res.body.password).toEqual('password');
    expect(res.body.email).toEqual('alice@email.com');

    done();
  });

  it('A Staff instance will not be successfully retrieved with an invalid staff ID', async (done) => {
    res = await TestClient.retrieveStaff(10);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual(Constants.Error.StaffNotFound);

    done();
  });

  it('A Staff instance will be created if valid information is provided', async (done) => {
    const staffData = { firstName: 'Chris', lastName: 'Chan', mobileNumber: '93456789', password: 'password', email: 'chris@email.com' };
    res = await TestClient.registerStaff(staffData);

    expect(res.status).toEqual(200);
    
    res = await TestClient.retrieveStaff(res.body.id);

    expect(res.status).toEqual(200);
    expect(res.body.firstName).toEqual('Chris');
    expect(res.body.lastName).toEqual('Chan');
    expect(res.body.mobileNumber).toEqual('93456789');
    expect(res.body.password).not.toBeNull();
    expect(res.body.email).toEqual('chris@email.com');

    done();
  });

  it.each`
    firstName  | lastName  | mobileNumber  | password      | email                | expectedError
    ${''}      | ${'Chan'} | ${'93456789'} | ${'password'} | ${'chris@email.com'} | ${Constants.Error.FirstNameRequired}
    ${'Chris'} | ${''}     | ${'93456789'} | ${'password'} | ${'chris@email.com'} | ${Constants.Error.LastNameRequired}
    ${'Chris'} | ${'Chan'} | ${''}         | ${'password'} | ${'chris@email.com'} | ${Constants.Error.MobileNumberRequired}
    ${'Chris'} | ${'Chan'} | ${'93456789'} | ${''}         | ${'chris@email.com'} | ${Constants.Error.PasswordRequired}
    ${'Chris'} | ${'Chan'} | ${'93456789'} | ${'password'} | ${''}                | ${Constants.Error.EmailRequired}
    ${'Chris'} | ${'Chan'} | ${'91234567'} | ${'password'} | ${'chris@email.com'} | ${Constants.Error.MobileNumberNotUnique}
    ${'Chris'} | ${'Chan'} | ${'93456789'} | ${'password'} | ${'alice@email.com'} | ${Constants.Error.EmailNotUnique}
    ${'Chris'} | ${'Chan'} | ${'93456789'} | ${'password'} | ${'chris'}           | ${Constants.Error.EmailInvalid}
  `(`With the first name '$firstname', last name '$lastName', mobile number '$mobileNumber', password '$password', and email '$email', there will be an error, '$expectError'`,
  async ({ firstName, lastName, mobileNumber, password, email, expectedError }, done) => {
    const staffData = { firstName, lastName, mobileNumber, password, email };
    res = await TestClient.registerStaff(staffData);

    expect(res.status).toEqual(400);
    expect(res.text).toEqual(expectedError);

    done();
  });

  // afterAll(async (done) => {
  //   await sequelize.truncate({ cascade: true });
  //   await sequelize.close();

  //   done();
  // });
});