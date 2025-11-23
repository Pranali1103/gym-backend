const httpStatus = require('http-status');
const mongoose = require("mongoose");
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const AccountBranch = require('../models/accountBranch.model');
const { Trainer } = require('../models');
const Member = require('../models/member.model');
const MembershipPlan = require('../models/membershipPlan.model');
const ProductCategory = require('../models/productCategory.model');
const Brand = require("../models/brand.model");
const Product = require("../models/product.model");
const Subscription = require('../models/subscription.model');
const { v4: uuidv4 } = require('uuid'); 
const AssignTrainer = require('../models/assignTrainer.model');
const HealthReport = require('../models/healthReport.model');


//  SUPERADMIN AUTH FUNCTIONS

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already registered');
  }

  const newSuperAdmin = await User.create({
    name,
    email,
    password,
    role: 'SUPERADMIN',
  });

  res.status(httpStatus.CREATED).send({
    message: 'SuperAdmin registered successfully',
    superadmin: newSuperAdmin,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.role !== 'SUPERADMIN') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials or role');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const tokens = await generateAuthTokens(user);

  res.send({
    message: 'Login successful',
    superadmin: user,
    tokens,
  });
});

// ACCOUNT FUNCTIONS (SuperAdmin Access)

const createAccount = catchAsync(async (req, res) => {
  const { user_id, owner_name, address, contact_info } = req.body;

  const account = await Account.create({
    user_id,
    owner_name,
    address,
    contact_info,
    super_admin_id: req.user._id,
  });

  res.status(httpStatus.CREATED).send({
    message: 'Account created successfully',
    account,
  });
});

const getAccounts = catchAsync(async (req, res) => {
  const accounts = await Account.find({ super_admin_id: req.user._id });
  res.send({
    count: accounts.length,
    accounts,
  });
});

const getAccountById = catchAsync(async (req, res) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  res.send(account);
});

const updateAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const updates = req.body;

  const account = await Account.findOneAndUpdate(
    { _id: accountId, super_admin_id: req.user._id },
    updates,
    { new: true }
  );

  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  res.send({
    message: 'Account updated successfully',
    account,
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findOneAndDelete({
    _id: accountId,
    super_admin_id: req.user._id,
  });

  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  res.send({
    message: 'Account deleted successfully',
  });
});

//  ACCOUNT BRANCH FUNCTIONS

const createBranch = async (user, data) => {
  try {
    const {
      account_id,
      name,
      street_address,
      city,
      zipcode,
      spoc_name,
      spoc_email,
      spoc_contact,
      area,
      status,
    } = data;

    const existingBranch = await AccountBranch.findOne({ spoc_email });
    if (existingBranch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'SPOC email already exists');
    }

    const branch = await AccountBranch.create({
      account_id,
      account_user_id: user._id,
      name,
      street_address,
      city,
      zipcode,
      spoc_name,
      spoc_email,
      spoc_contact,
      area,
      status,
    });

    return branch;
  } catch (error) {
    console.log("error-----------------", error);

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating branch');
  }
};

const getBranches = async (user) => {
  try {
    return await AccountBranch.find({ account_user_id: user._id });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching branches');
  }
};

const updateBranch = async (id, updateData) => {
  try {
    const branch = await AccountBranch.findByIdAndUpdate(id, updateData, { new: true });
    if (!branch) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
    }
    return branch;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating branch');
  }
};

const deleteBranch = async (id) => {
  try {
    const branch = await AccountBranch.findByIdAndDelete(id);
    if (!branch) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
    }
    return branch;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting branch');
  }
};

//  TRAINER FUNCTIONS

const createTrainer = async (req, res) => {
  console.log("Trainer creation started");

  const user = req.user;
  console.log("Logged-in User:", user);

  const account = await Account.findOne({ user_id: user._id });
  console.log("Account found:", account ? account._id : "No account found");

  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');
  }

  const {
    branch_id,
    name,
    dob,
    blood_group,
    gender,
    phone_number,
    email,
    specialization,
    height,
    weight,
    // status,
  } = req.body;

  console.log("Payload:", req.body);

  const existingTrainer = await Trainer.findOne({
    $or: [{ email }, { phone_number }],
  });
  console.log("Existing Trainer:");

  if (existingTrainer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Trainer email or phone already exists');
  }

  const trainer = await Trainer.create({
    account_id: account._id,
    branch_id,
    user_id: user._id,
    name,
    dob,
    blood_group,
    gender,
    phone_number,
    email,
    specialization,
    height,
    weight,
    // status,
  });

  console.log("Trainer saved in DB:", trainer);
  return trainer;
};

const getTrainers = (async (req, res) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');

  const trainers = await Trainer.find({ account_id: account._id });
  return trainers;

});

const getTrainerById = (async (req, res) => {
  const trainer = await Trainer.findById(req.params.trainerId);
  if (!trainer) throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');

  res.json(trainer);
});

const updateTrainer = async (trainerId, updateData) => {
  console.log("Incoming trainerId:", trainerId);
  console.log("Update Data:", updateData);

  const trainers = await Trainer.findByIdAndUpdate(trainerId, updateData, { new: true });

  if (!trainers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');
  }
  return trainers;
};

const deleteTrainer = async (trainerId) => {
  console.log("Deleting Trainer ID:", trainerId);

  const trainer = await Trainer.findByIdAndDelete(trainerId);
  if (!trainer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');
  }
  return trainer;
};

//  MEMBER SERVICE FUNCTIONS

const createMember = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');
  }

  const {
    branch_id,
    name,
    phone_number,
    blood_group,
    gender,
    dob,
    address,
    street,
    area,
    zipcode,
     height,
    weight,
  } = req.body;

  const existingMember = await Member.findOne({ phone_number });
  if (existingMember) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Member with this phone number already exists');
  }

  const member = await Member.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    name,
    phone_number,
    blood_group,
    gender,
    dob,
    address,
    street,
    area,
    zipcode,
    height,
    weight,
  });

  return member;
};

const getMembers = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');
  }

  return await Member.find({ account_id: account._id });
};

const getMemberById = async (memberId) => {
  const member = await Member.findById(memberId);
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  return member;
};

const updateMember = async (memberId, updateData) => {
  const member = await Member.findByIdAndUpdate(memberId, updateData, { new: true });
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  return member;
};

const deleteMember = async (memberId) => {
  const member = await Member.findByIdAndDelete(memberId);
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  return member;
};

// MEMBERSHIP PLAN SERVICE FUNCTIONS

const createMembershipPlan = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');
  }

  const {
    branch_id,
    plan_name,
    plan_type,
    description,
    duration,
    price,
    discount_type,
    discount,
    status,
  } = req.body;

  const existingPlan = await MembershipPlan.findOne({ plan_name, account_id: account._id });
  if (existingPlan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Membership plan with this name already exists');
  }

  const newPlan = await MembershipPlan.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    plan_name,
    plan_type,
    description,
    duration,
    price,
    discount_type,
    discount,
    status,
  });

  return newPlan;
};

const getMembershipPlans = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');
  }

  return await MembershipPlan.find({ account_id: account._id });
};

const getMembershipPlanById = async (planId) => {
  const plan = await MembershipPlan.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership plan not found');
  }
  return plan;
};

const updateMembershipPlan = async (planId, updateData) => {
  const plan = await MembershipPlan.findByIdAndUpdate(planId, updateData, { new: true });
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership plan not found');
  }
  return plan;
};

const deleteMembershipPlan = async (planId) => {
  const plan = await MembershipPlan.findByIdAndDelete(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Membership plan not found');
  }
  return plan;
};

//  PRODUCT CATEGORY SERVICE FUNCTIONS
const { v2: cloudinary } = require("cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE
const createProductCategory = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  const { branch_id, product_name, status } = req.body;

  if (!product_name || !product_name.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product name is required');
  }

  const existingCategory = await ProductCategory.findOne({
    product_name: product_name.trim(),
    account_id: account._id,
  });
  if (existingCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product category with this name already exists');
  }

let imageUrl = null;
  if (req.files && req.files.length > 0) {

  const file = req.files[0];

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gym_images", 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Pipe the buffer to Cloudinary
    uploadStream.end(file.buffer);
  });

  imageUrl = result.secure_url; 
}

  const category = await ProductCategory.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    product_name: product_name.trim(),
    product_img: imageUrl,
    status: status || 'ACTIVE',
  });

  return category;
};

// GET ALL
const getProductCategories = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  return await ProductCategory.find({ account_id: account._id });
};

// GET BY ID
const getProductCategoryById = async (categoryId) => {
  const category = await ProductCategory.findById(categoryId);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found');
  return category;
};

// UPDATE 
const updateProductCategory = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  const { categoryId } = req.params;
  const { branch_id, product_name, status } = req.body;

  const category = await ProductCategory.findOne({
    _id: categoryId,
    account_id: account._id,
  });

  if (!category)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found for this account');

  let imageUrl = category.product_img;
  if (req.files && req.files.length > 0) {
    const file = req.files[0];

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'gym_images' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });

    imageUrl = result.secure_url;
  }

  category.branch_id = branch_id || category.branch_id;
  category.product_name = product_name ? product_name.trim() : category.product_name;
  category.status = status || category.status;
  category.product_img = imageUrl;

  await category.save();

  return category;
};

// DELETE
const deleteProductCategory = async (categoryId) => {
  const category = await ProductCategory.findByIdAndDelete(categoryId);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found');
  return category;
};


//  BRAND SERVICE FUNCTIONS

// CREATE BRAND
const createBrand = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  const { branch_id, brand_name, status } = req.body;

  if (!brand_name || !brand_name.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Brand name is required');
  }

  const existingBrand = await Brand.findOne({
    brand_name: brand_name.trim(),
    account_id: account._id,
  });
  if (existingBrand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Brand with this name already exists');
  }

  let imageUrl = null;
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'brand_images' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });
    imageUrl = result.secure_url;
  }

  const brand = await Brand.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    brand_name: brand_name.trim(),
    image: imageUrl,
    status: status || 'ACTIVE',
  });

  return brand;
};

// GET ALL BRANDS

const getAllBrands = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const brands = await Brand.find({ account_id: account._id });

  return brands;
};


// GET BRAND BY ID
const getBrandById = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { brandId } = req.params;

  const brand = await Brand.findOne({
    _id: brandId,
    account_id: account._id,
  });

  if (!brand)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found for this account");

  return brand;
};

// UPDATE BRAND
const updateBrand = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { brandId } = req.params;
  const { branch_id, brand_name, status } = req.body;

  const brand = await Brand.findOne({
    _id: brandId,
    account_id: account._id,
  });
  if (!brand)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found for this account");

  let imageUrl = brand.image;
  if (req.files && req.files.length > 0) {
    const file = req.files[0];

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "brand_images" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });

    imageUrl = result.secure_url;
  }

  brand.brand_name = brand_name ? brand_name.trim() : brand.brand_name;
  brand.status = status || brand.status;
  brand.branch_id = branch_id || brand.branch_id;
  brand.image = imageUrl;

  await brand.save();

  return brand;
};


// DELETE BRAND
const deleteBrand = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { brandId } = req.params;

  const brand = await Brand.findOne({
    _id: brandId,
    account_id: account._id,
  });

  if (!brand)
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found for this account");

  await Brand.deleteOne({ _id: brand._id });

  return { message: "Brand deleted successfully" };
};

// PRODUCT SERVICES 

// CREATE PRODUCT
const createProduct = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const {
    // branch_id,
    product_category_id,
    brand_id,
    product_name,
    description,
    price,
    discount,
    stock,
    status,
  } = req.body;

  if (!product_name?.trim())
    throw new ApiError(httpStatus.BAD_REQUEST, "Product name is required");

  const existing = await Product.findOne({
    product_name: product_name.trim(),
    account_id: account._id,
  });
  if (existing)
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already exists for this account");

  let imageUrl = null;
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "product_images" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });
    imageUrl = result.secure_url;
  }

  const product = await Product.create({
    account_id: account._id,
    user_id: user._id,
    // branch_id,
    product_category_id,
    brand_id,
    product_name: product_name.trim(),
    description,
    price,
    discount,
    stock,
    image: imageUrl,
    status: status || "ACTIVE",
  });

  return product;
};

// GET ALL PRODUCTS
const getAllProducts = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  return Product.find({ account_id: account._id })
    .populate("product_category_id", "product_name")
    .populate("brand_id", "brand_name");
};

// GET PRODUCT BY ID
const getProductById = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    account_id: account._id,
  })
    .populate("product_category_id", "product_name")
    .populate("brand_id", "brand_name");

  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found for this account");

  return product;
};

// UPDATE PRODUCT
const updateProduct = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { productId } = req.params;
  const {
    branch_id,
    product_category_id,
    brand_id,
    product_name,
    description,
    price,
    discount,
    stock,
    status,
  } = req.body;

  const product = await Product.findOne({
    _id: productId,
    account_id: account._id,
  });

  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found for this account");

  let imageUrl = product.image;
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "product_images" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(file.buffer);
    });
    imageUrl = result.secure_url;
  }

  product.branch_id = branch_id || product.branch_id;
  product.product_category_id = product_category_id || product.product_category_id;
  product.brand_id = brand_id || product.brand_id;
  product.product_name = product_name ? product_name.trim() : product.product_name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discount = discount || product.discount;
  product.stock = stock || product.stock;
  product.status = status || product.status;
  product.image = imageUrl;

  await product.save();
  return product;
};

// DELETE PRODUCT
const deleteProduct = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account not found for this user");

  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    account_id: account._id,
  });

  if (!product)
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found for this account");

  await product.deleteOne({ _id: product._id });
  return { message: "Product deleted successfully" };
};


// SUBSCIPTION SERVICE FUNCTIONS

const createSubscription = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  const { branch_id, member_id, membershipplan_id, payment_mode, amount } = req.body;

  if (!member_id || !membershipplan_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Member ID and Membership Plan ID are required');
  }

  const membershipPlan = await MembershipPlan.findById(membershipplan_id);
  if (!membershipPlan) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Membership Plan');

  // validate amount against plan price
  if (Number(amount) !== Number(membershipPlan.price)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment amount must match plan price');
  }

  // Check if member already has an active subscription
  const activeSubscription = await Subscription.findOne({
    member_id,
    status: 'ACTIVE',
    end_date: { $gte: new Date() },
  });

  if (activeSubscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Member already has an active subscription');
  }

  // calculate start & end date
  const startDate = new Date();
  let endDate = new Date(startDate);

  if (membershipPlan.plan_type === 'MONTHLY') {
    endDate.setMonth(endDate.getMonth() + membershipPlan.duration);
  } else if (membershipPlan.plan_type === 'YEARLY') {
    endDate.setFullYear(endDate.getFullYear() + membershipPlan.duration);
  } else if (membershipPlan.plan_type === 'WEEKLY') {
    endDate.setDate(endDate.getDate() + 7 * membershipPlan.duration);
  } else {
    endDate.setMonth(endDate.getMonth() + 1); 
  }

  const subscription = await Subscription.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    member_id,
    membershipplan_id,
    payment_mode,
    amount,
    payment_status: 'SUCCESS',
    status: 'ACTIVE',
    start_date: startDate,
    end_date: endDate,
    transaction_id: `TXN-${Date.now()}`,
    payment_date: new Date(),
  });

  return subscription;
};


const getAllSubscriptions = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found for this user');

  return await Subscription.find({ account_id: account._id })
    .populate('member_id', 'name phone_number')
    .populate('membershipplan_id', 'plan_name duration price');
};

const getSubscriptionById = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate('member_id', 'name phone_number') 
    .populate('membershipplan_id', 'plan_name price duration') 
    .populate('branch_id', 'name') 
    .lean();

  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  return subscription;
};


const updateSubscription = async (subscriptionId, updateData) => {

  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  const allowedFields = [
    'branch_id',
    'member_id',
    'membershipplan_id',
    'payment_mode',
    'amount',
    'payment_status',
    'status',
  ];

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      subscription[key] = updateData[key];
    }
  }

  await subscription.save();

  return subscription;
};


const deleteSubscription = async (subscriptionId) => {
  const existingSubscription = await Subscription.findByIdAndDelete(subscriptionId);

  if (!existingSubscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  return existingSubscription;
};

// ASSIGN TRAINER TO MEMBER SERVICE FUNCTION

const assignTrainer = async (req) => {
  const user = req.user;

  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');

  const { branch_id, member_id, trainer_id } = req.body;

  // OLD ACTIVE TRAINER - INACTIVE
  const existingAssignment = await AssignTrainer.findOne({
    member_id,
    status: 'ACTIVE'
  });

  if (existingAssignment) {
    existingAssignment.status = 'INACTIVE';
    existingAssignment.end_date = new Date();
    await existingAssignment.save();
  }

  // NEW ASSIGNMENT CREATE
  const assignment = await AssignTrainer.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    member_id,
    trainer_id,
    assigned_by: user._id,
    start_date: new Date(),
    status: 'ACTIVE',
  });

  // POPULATE RESPONSE
  const populatedAssignment = await AssignTrainer.findById(assignment._id)
    .populate('member_id', 'name phone_number')
    .populate('trainer_id', 'name phone_number specialization')
    .populate('branch_id', 'name');

  return populatedAssignment;
};

const getAssignedTrainer = async (memberId) => {
  const assignment = await AssignTrainer.findOne({ member_id: memberId })
    .populate('trainer_id', 'name phone_number specialization')
    .populate('member_id', 'name phone_number')
    .populate('branch_id', 'name')
    .lean();

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No trainer assigned to this member');
  }

  return assignment;
};

const updateAssignTrainer = async (assignmentId, updateData) => {
  const assignment = await AssignTrainer.findById(assignmentId);

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer assignment not found');
  }

  const allowedUpdates = ['status', 'end_date', 'notes'];
  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      assignment[key] = updateData[key];
    }
  });

  // Auto-handling INACTIVE
  if (updateData.status === 'INACTIVE' && !assignment.end_date) {
    assignment.end_date = new Date();
  }

  await assignment.save();

  return await assignment.populate('member_id trainer_id', 'name phone_number specialization');
};

const deleteAssignTrainer = async (assignmentId) => {
  const assignment = await AssignTrainer.findByIdAndDelete(assignmentId);

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer assignment not found');
  }

  return assignment;
};

// HEALTH REPORT SERVICE FUNCTIONS

const createHealthReport = async (req) => {
  const user = req.user;
  const account = await Account.findOne({ user_id: user._id });
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');

  const {
    branch_id,
    member_id,
    // gender,
    height,
    weight,
    body_fat_percentage,
    muscle_mass,
    water_percentage,
    chest,
    waist,
    biceps,
    thigh,
    bust,
    hips,
    blood_pressure_systolic,
    blood_pressure_diastolic,
    heart_rate,
    resting_metabolism,
    BMR,
    progress_notes,
  } = req.body;

    // AUTO-GET gender from Member model — no need in payload
  const member = await Member.findById(member_id);
  if (!member) throw new ApiError(httpStatus.BAD_REQUEST, "Member not found");

  const gender = member.gender; 

  // AUTO BMI
  const BMI = height && weight ? (weight / ((height / 100) ** 2)).toFixed(2) : null;

  // NESTED object formatting as per schema
  const formattedHeight = height ? { value: height, unit: "cm" } : null;
  const formattedWeight = weight ? { value: weight, unit: "kg" } : null;
  const formattedBMI = BMI ? { value: BMI, unit: "kg/m²" } : null;

  const formattedMuscleMass = muscle_mass
    ? { value: muscle_mass, unit: "kg" }
    : null;

  // GENDER-WISE PARAMETERS
  const male_parameters = gender === "MALE"
    ? { chest, waist, biceps, thigh }
    : null;

  const female_parameters = gender === "FEMALE"
    ? { bust, waist, hips, thigh }
    : null;

  // CREATE DOCUMENT
  const report = await HealthReport.create({
    account_id: account._id,
    user_id: user._id,
    branch_id,
    member_id,
    report_month: new Date().toLocaleString("en-US", { month: "long" }),
    // gender,
    height: formattedHeight,
    weight: formattedWeight,
    BMI: formattedBMI,
    muscle_mass: formattedMuscleMass,
    body_fat_percentage,
    water_percentage,
    male_parameters,
    female_parameters,
    blood_pressure_systolic,
    blood_pressure_diastolic,
    heart_rate,
    resting_metabolism,
    BMR,
    progress_notes,
  });

 return report; 
};

const getHealthReport = async (memberId) => {
  const report = await HealthReport.find({ member_id: memberId })
    .populate('member_id', 'name phone_number')
    .sort({ createdAt: -1 });

  if (!report || report.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No report found for this member');
  }

  return report;
};

const getHealthReportByID = async (reportId) => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid HealthReport ID");
  }

  const report = await HealthReport.findById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Health report not found");
  }

  const memberId = report.member_id;
  const month = report.report_month;
  const year = new Date(report.createdAt).getFullYear();

  const allReports = await HealthReport.find({
    member_id: memberId,
    report_month: month,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)
    }
  });

  return [
    {
      year,
      month,
      reports: allReports
    }
  ];
};

const updateHealthReport = async (reportId, body) => {
  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid HealthReport ID");
  }

  const updated = await HealthReport.findByIdAndUpdate(
    reportId,
    { $set: body },
    { new: true, runValidators: true }
  )
    .populate("member_id", "name phone_number")
    .populate("user_id", "name email")
    .populate("branch_id", "name")
    .populate("account_id", "name");

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  return updated;
};


const deleteHealthReport = async (reportId) => {
  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid HealthReport ID");
  }

  const deleted = await HealthReport.findByIdAndDelete(reportId);

  if (!deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Health report not found");
  }

  return deleted;
};




//  EXPORT ALL

module.exports = {

  // SuperAdmin Auth
  register,
  login,

  // Account
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,

  // Account Branch
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,

  // Trainer
  createTrainer,
  getTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,

  // Member
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,

  // Membership Plan
  createMembershipPlan,
  getMembershipPlans,
  getMembershipPlanById,
  updateMembershipPlan,
  deleteMembershipPlan,

  // Product Category
  createProductCategory,
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,

  // Brand
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,

  // Product
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,

  // Subscription
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,

  // Assign Trainer
  assignTrainer,
  getAssignedTrainer,
  updateAssignTrainer,
  deleteAssignTrainer,

  // Health Report
  createHealthReport,
  getHealthReport,
  getHealthReportByID,
  updateHealthReport,
  deleteHealthReport,
};
