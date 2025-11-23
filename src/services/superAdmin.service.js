const SuperAdmin = require('../models/superAdmin.model');
const Account = require('../models/account.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../config/config');

const register = async (data) => {
  const exists = await SuperAdmin.findOne({ email: data.email });
  if (exists) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already registered');

  const user = await SuperAdmin.create(data);
  return user;
};

const login = async (data) => {
  const user = await SuperAdmin.findOne({ email: data.email });
  if (!user || !(await user.isPasswordMatch(data.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  //  Capitalized role
  const token = jwt.sign({ id: user._id, role: 'SUPERADMIN' }, config.jwt.secret, {
    expiresIn: '1d',
  });

  return { user, token };
};

const createAccount = async (req, data) => {
  console.log('req.user ============', req.user);

  const { name, email, password, owner_name, address, contact_info } = data;

  let payload = req.body;
  payload.role = 'ACCOUNT_USER'; //  Capitalized

  // Check if email already exists
  if (await User.isEmailTaken(payload.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Create account user
  const userData = await User.create(payload);
  console.log('userData ========', userData);

  // Create account and link with superadmin
  const superAdminId = req.user._id;
  const account = await Account.create({
    user_id: userData._id,
    owner_name,
    address,
    contact_info,
    super_admin_id: superAdminId,
  });

  return { userData, account };
};

const getAccounts = async () => {
  const findAccounts = await Account.find();
  return findAccounts;
};

const updateAccount = async (id, updateData) => {
  const account = await Account.findById(id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  Object.assign(account, updateData);
  await account.save();

  return { message: 'Account updated successfully', account };
};

const deleteAccount = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  await account.deleteOne();
  return { message: 'Account deleted successfully' };
};

module.exports = {
  register,
  login,
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};
