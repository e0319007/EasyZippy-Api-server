const request = require('supertest');
const app = require('../app');

module.exports = {
  registerStaff: async (data) => request(app).post(`/staff`).send(data),
  retrieveStaff: async (id) => request(app).get(`/staff/${id}`),
  retrieveAllStaff: async () => request(app).get(`/staff`),
  updateStaff: async (id, updateDict) => request(app).put(`/staff/${id}`).send(updateDict),
  disableStaff: async (id) => request(app).put(`/staff/${id}/disable`)
};