const catchAsync = require('../utils/catchAsync');
const accountService = require('../services/account.service');
const httpStatus = require('http-status');
const HealthReport = require("../models/healthReport.model");

// ACCOUNT CONTROLLERS

const createAccount = catchAsync(async (req, res) => {
  const account = await accountService.createAccount(req.body);
  res.status(201).send(account);
});

const getAccounts = catchAsync(async (req, res) => {
  const accounts = await accountService.getAccounts();
  res.send(accounts);
});

const getAccountById = catchAsync(async (req, res) => {
  const account = await accountService.getAccountById(req.params.id);
  res.send(account);
});

const updateAccount = catchAsync(async (req, res) => {
  const updated = await accountService.updateAccount(req.params.id, req.body);
  res.send(updated);
});

const deleteAccount = catchAsync(async (req, res) => {
  await accountService.deleteAccount(req.params.id);
  res.status(204).send();
});


// ACCOUNT BRANCH CONTROLLERS 

const createBranch = catchAsync(async (req, res) => {
  const branch = await accountService.createBranch(req.user, req.body);
  res.status(201).send({
    status: "success",
    message: 'Branch created successfully',
    data: branch,
  });
});

const getBranches = catchAsync(async (req, res) => {
  const branches = await accountService.getBranches(req.user);
  res.send({
    status: "success",
    message: 'Branches fetched successfully',
    count: branches.length,
    data: branches,
  });
});

const updateBranch = catchAsync(async (req, res) => {
  const branch = await accountService.updateBranch(req.params.branchId, req.body);
  res.send({
    status: "success",
    message: 'Branch updated successfully',
    data: branch,
  });
});

const deleteBranch = catchAsync(async (req, res) => {
  await accountService.deleteBranch(req.params.branchId);
  res.send({
    status: "success",
    message: 'Branch deleted successfully',
  });
});

// TRAINER CONTROLLERS

const createTrainer = catchAsync(async (req, res) => {
  const trainer = await accountService.createTrainer(req);
  res.status(httpStatus.CREATED).send({
    status: "success",
    message: "Trainer created successfully",
    data: trainer,
  });
});

const getTrainers = catchAsync(async (req, res) => {
  const trainers = await accountService.getTrainers(req);
  res.status(200).send({
    status: 'success',
    message: 'Trainers fetched successfully',
    count: trainers.length,
    data: trainers,
  });
});

const getTrainerById = catchAsync(async (req, res) => {
  const trainer = await accountService.getTrainerById(req.params.trainerId);
  res.status(200).send({
    status: 'success',
    message: 'Trainer fetched successfully',
    data: trainer,
  });
});

const updateTrainer = catchAsync(async (req, res) => {
  console.log("PARAMS:", req.params);
  const trainers = await accountService.updateTrainer(req.params.trainerId, req.body);
  res.status(200).send({
    status: 'success',
    message: 'Trainer updated successfully',
    data: trainers,
  });
});

const deleteTrainer = catchAsync(async (req, res) => {
  await accountService.deleteTrainer(req.params.trainerId);
  res.status(200).send({
    status: 'success',
    message: 'Trainer deleted successfully',
  });
});

//  MEMBER CONTROLLER FUNCTIONS

const createMember = catchAsync(async (req, res) => {
  const member = await accountService.createMember(req);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Member created successfully',
    data: member,
  });
});

const getMembers = catchAsync(async (req, res) => {
  const members = await accountService.getMembers(req);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Members fetched successfully',
    count: members.length,
    data: members,
  });
});

const getMemberById = catchAsync(async (req, res) => {
  const member = await accountService.getMemberById(req.params.memberId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Member fetched successfully',
    data: member,
  });
});

const updateMember = catchAsync(async (req, res) => {
  const member = await accountService.updateMember(req.params.memberId, req.body);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Member updated successfully',
    data: member,
  });
});


const deleteMember = catchAsync(async (req, res) => {
  await accountService.deleteMember(req.params.memberId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Member deleted successfully',
  });
});

//  MEMBERSHIP PLAN CONTROLLERS
const createMembershipPlan = catchAsync(async (req, res) => {
  const plan = await accountService.createMembershipPlan(req);
  res.status(201).send({
    status: 'success',
    message: 'Membership plan created successfully',
    data: plan,
  });
});

const getMembershipPlans = catchAsync(async (req, res) => {
  const plans = await accountService.getMembershipPlans(req);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Membership plans fetched successfully',
    data: plans,
  });
});

const getMembershipPlanById = catchAsync(async (req, res) => {
  const plan = await accountService.getMembershipPlanById(req.params.planId, req.user);
  res.status(200).send({
    status: 'success',
    message: 'Membership plan fetched successfully',
    data: plan,
  });
});

const updateMembershipPlan = catchAsync(async (req, res) => {
  const plan = await accountService.updateMembershipPlan(req.params.planId, req.body);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Membership plan updated successfully',
    data: plan,
  });
});

const deleteMembershipPlan = catchAsync(async (req, res) => {
  await accountService.deleteMembershipPlan(req.params.planId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Membership plan deleted successfully',
  });
});


//  PRODUCT CATEGORY CONTROLLERS

const createProductCategory = catchAsync(async (req, res) => {
  const category = await accountService.createProductCategory(req);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Product category created successfully',
    data: category,
  });
});

const getProductCategories = catchAsync(async (req, res) => {
  const categories = await accountService.getProductCategories(req);
  res.send({
    status: 'success',
    message: 'Fetched all product categories',
    data: categories,
  });
});

const getProductCategoryById = catchAsync(async (req, res) => {
  const category = await accountService.getProductCategoryById(req.params.categoryId);
  res.send({
    status: 'success',
    message: 'Fetched product category successfully',
    data: category,
  });
});

const updateProductCategory = catchAsync(async (req, res) => {
  const category = await accountService.updateProductCategory(req);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Product category updated successfully',
    data: category,
  });
});


const deleteProductCategory = catchAsync(async (req, res) => {
  await accountService.deleteProductCategory(req.params.categoryId);
  res.send({
    status: 'success',
    message: 'Product category deleted successfully',
  });
});

// BRAND CONTROLLERS 
const createBrand = catchAsync(async (req, res) => {
  const brand = await accountService.createBrand(req);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Brand created successfully',
    data: brand,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const brands = await accountService.getAllBrands(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "All brands fetched successfully",
    data: brands,
  });
});

const getBrandById = catchAsync(async (req, res) => {
  const brand = await accountService.getBrandById(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Brand fetched successfully",
    data: brand,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await accountService.updateBrand(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Brand updated successfully",
    data: brand,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const result = await accountService.deleteBrand(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: 'Brand deleted successfully',
  });
});

// PRODUCT CONTROLLERS

const createProduct = catchAsync(async (req, res) => {
  const product = await accountService.createProduct(req);
  res.status(httpStatus.CREATED).send({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await accountService.getAllProducts(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Products fetched successfully",
    data: products,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const product = await accountService.getProductById(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Product fetched successfully",
    data: product,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await accountService.updateProduct(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await accountService.deleteProduct(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: 'Product deleted successfully',
  });
});

// SUBSCRIPTION CONTROLLERS
const createSubscription = catchAsync(async (req, res) => {
  const subscription = await accountService.createSubscription(req);
  res.status(httpStatus.CREATED).send({
    status: "success",
    message: "Subscription created successfully",
    data: subscription,
  });
});

const getAllSubscriptions = catchAsync(async (req, res) => {
  const subscriptions = await accountService.getAllSubscriptions(req);
  res.status(httpStatus.OK).send({
    status: "success",
    message: "Subscriptions fetched successfully",
    data: subscriptions,
  });
});

const getSubscriptionById = catchAsync(async (req, res) => {
  const subscription = await accountService.getSubscriptionById(req.params.subscriptionId);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Subscription fetched successfully',
    data: subscription,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const updated = await accountService.updateSubscription(req.params.subscriptionId, req.body);
  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Subscription updated successfully',
    data: updated,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await accountService.deleteSubscription(req.params.subscriptionId, req.body);
  res.status(httpStatus.OK).send({
    status: "success",
    message: 'Subscription deleted successfully',
  });
});


// ASSIGN TRAINER CONTROLLER
const assignTrainer = catchAsync(async (req, res) => {
  const assignment = await accountService.assignTrainer(req);

  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Trainer assigned successfully',
    data: assignment,
  });
});

const getAssignedTrainer = catchAsync(async (req, res) => {
  const { memberId } = req.params;

  const assignment = await accountService.getAssignedTrainer(memberId);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Assigned trainer fetched successfully',
    data: assignment,
  });
});

const updateAssignTrainer = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;

  const updated = await accountService.updateAssignTrainer(assignmentId, req.body);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Trainer assignment updated successfully',
    data: updated,
  });
});

const deleteAssignTrainer = catchAsync(async (req, res) => {
  const { assignmentId } = req.params;

  await accountService.deleteAssignTrainer(assignmentId);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Trainer assignment deleted successfully',
  });
});

// Health Report Functions

const createHealthReport = catchAsync(async (req, res) => {
  const report = await accountService.createHealthReport(req);

  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Health report created successfully',
    data: report,
  });
});

const getHealthReport = catchAsync(async (req, res) => {
  const reports = await HealthReport.find()
    .populate("member_id", "name phone_number")
    .populate("user_id", "name email")
    .populate("branch_id", "name")
    .populate("account_id", "name");

  res.status(httpStatus.OK).json({
    status: 'success',
    count: reports.length,
    data: reports,
  });
});


// const getHealthReportByID = catchAsync(async (req, res) => {
//   const reportId = req.params.reportId;

//   const reports = await accountService.getHealthReportByID(reportId);

//   res.status(httpStatus.OK).send({
//     status: "success",
//     message: "Health reports fetched successfully",
//     data: reports,
//   });
// });

const getHealthReportByID = catchAsync(async (req, res) => {
  const { reportId } = req.params;

  const data = await accountService.getHealthReportByID(reportId);

  res.status(200).send({
   status: 'success',
    message: "Health reports fetched successfully",
    data,
  });
});


const updateHealthReport = catchAsync(async (req, res) => {
  const reportId = req.params.reportId;

  const updated = await accountService.updateHealthReport(
    reportId,
    req.body
  );

  res.status(httpStatus.OK).send({
    status: "success",
    message: "Health report updated",
    data: updated,
  });
});

const deleteHealthReport = catchAsync(async (req, res) => {
  const { reportId } = req.params;

  const deleted = await accountService.deleteHealthReport(reportId);

  res.status(httpStatus.OK).send({
    status: "success",
    message: "Health report deleted successfully",
  });
});



module.exports = {
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
  deleteHealthReport
};



