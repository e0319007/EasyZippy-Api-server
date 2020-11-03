const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

module.exports = {
  retrieveStaffRoles: async (token) => request.get(`/staff/staffRoles`).set('AuthToken', token),
  retrieveStaff: async (token, id) => request.get(`/staff/${id}`).set('AuthToken', token),
  retrieveAllStaff: async (token) => request.get(`/staff`).set('AuthToken', token),
  updateStaffRole: async (token, id, data) => request.put(`/staff/staffRole/${id}`).send(data).set('AuthToken', token),
  changePassword: async (token, id, data) => request.put(`/staff/${id}/changePassword`).send(data).set('AuthToken', token),
  updateStaff: async (token, id, data) => request.put(`/staff/${id}`).send(data).set('AuthToken', token),
  toggleDisableStaff: async (token, id) => request.put(`/staff/${id}/toggleDisable`).set('AuthToken', token),
  loginStaff: async (data) => request.post(`/staff/login`).send(data),
  retrieveStaffByEmail: async (token, data) => request.post(`/staff/email`).send(data).set('AuthToken', token),
  sendResetPasswordEmail: async (data) => request.post(`/staff/forgotPassword`).send(data),
  checkValidToken: async (data) => request.post(`/staff/resetPassword/checkValidToken`).send(data),
  resetPassword: async (data) => request.post(`/staff/resetPassword`).send(data),
  registerStaff: async (token, data) => request.post(`/staff`).send(data).set('AuthToken', token)
};