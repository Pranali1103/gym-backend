const catchAsync = require('../utils/catchAsync');
const superAdminService = require('../services/superAdmin.service');

const register = catchAsync(async (req, res) => {
  const result = await superAdminService.register(req.body);
  res.status(201).send({
    status: 'success',
    message: 'Super admin registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await superAdminService.login(req.body);
  res.status(200).send({
    status: 'success',
    message: 'Login successful',
    data: result,
  });
});

const createAccount = catchAsync(async (req, res) => {
  const result = await superAdminService.createAccount(req, req.body);
  res.status(201).send({
    status: 'success',
    message: 'Account created successfully',
    data: result,
  });
});

const getAccounts = catchAsync(async (req, res) => {
  const accounts = await superAdminService.getAccounts();
  res.status(200).send({
    status: 'success',
    message: 'Accounts fetched successfully',
    data: accounts,
  });
});

const updateAccount = catchAsync(async (req, res) => {
  const account = await superAdminService.updateAccount(req.params.accountId, req.body);
  res.status(200).send({
    status: 'success',
    message: 'Account updated successfully',
    data: account,
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const result = await superAdminService.deleteAccount(req.params.accountId);
  res.status(200).send({
    status: 'success',
    message: 'Account deleted successfully',
    data: result || null,
  });
});


module.exports = {
  register,
  login,
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};
