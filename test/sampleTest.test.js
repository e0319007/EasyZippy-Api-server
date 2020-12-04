const TestClient = require('./testClient');
const sequelize = require('../app/common/database');

describe('Sample Test Desc', () => {

  beforeAll(async (done) => {
    await sequelize.truncate({ cascade: true });
    done();
  });

  it('Sample Case', async (done) => {
    expect(true).toEqual(true);
    done();
  });

  afterAll(async (done) => {
    await sequelize.truncate({ cascade: true });
    await sequelize.close();
    done();
  });
}); 