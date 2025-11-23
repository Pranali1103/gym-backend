const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const accountController = require('../../controllers/account.controller'); 
const accountValidation = require('../../validations/account.validation');
const multer = require('multer');
const uploads = multer();


// ACCOUNT BRANCH ROUTES 
router.post('/branch', auth('ACCOUNT_USER'), accountController.createBranch);
router.get('/branches', auth('ACCOUNT_USER'), accountController.getBranches);
router.put('/branches/:branchId', auth('ACCOUNT_USER'), accountController.updateBranch);
router.delete('/branches/:branchId', auth('ACCOUNT_USER'), accountController.deleteBranch);

// TRAINER ROUTES 
router.post('/trainer', auth('ACCOUNT_USER'), validate(accountValidation.createTrainer), accountController.createTrainer);
router.get('/trainers', auth('ACCOUNT_USER'), validate(accountValidation.getTrainers), accountController.getTrainers);
router.get('/trainers/:trainerId', auth('ACCOUNT_USER'), accountController.getTrainerById);
router.put('/trainers/:trainerId', auth('ACCOUNT_USER'),  validate(accountValidation.updateTrainer), accountController.updateTrainer);
router.delete('/trainers/:trainerId', auth('ACCOUNT_USER'), validate(accountValidation.deleteTrainer), accountController.deleteTrainer);

// MEMBER ROUTES
router.post('/member', auth('ACCOUNT_USER'), validate(accountValidation.createMember), accountController.createMember);
router.get('/members', auth('ACCOUNT_USER'), accountController.getMembers);
router.get('/members/:memberId', auth('ACCOUNT_USER'), accountController.getMemberById);
router.put('/members/:memberId', auth('ACCOUNT_USER'), validate(accountValidation.updateMember), accountController.updateMember);
router.delete('/members/:memberId', auth('ACCOUNT_USER'), accountController.deleteMember);

// MEMBERSHIP PLAN ROUTES
router.post('/membership-plan', auth('ACCOUNT_USER'), validate(accountValidation.createMembershipPlan), accountController.createMembershipPlan);
router.get('/membership-plans', auth('ACCOUNT_USER'), accountController.getMembershipPlans);
router.get('/membership-plans/:planId', auth('ACCOUNT_USER'), accountController.getMembershipPlanById);
router.put('/membership-plans/:planId', auth('ACCOUNT_USER'), validate(accountValidation.updateMembershipPlan), accountController.updateMembershipPlan);
router.delete('/membership-plans/:planId', auth('ACCOUNT_USER'), accountController.deleteMembershipPlan);

// PRODUCT CATEGORY ROUTES
router.post('/product-category', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.createProductCategory),accountController.createProductCategory);
router.get('/product-categories', auth('ACCOUNT_USER'), accountController.getProductCategories);
router.get('/product-category/:categoryId', auth('ACCOUNT_USER'), uploads.any(), accountController.getProductCategoryById);
router.put('/product-category/:categoryId', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.updateProductCategory), accountController.updateProductCategory);
router.delete('/product-category/:categoryId', auth('ACCOUNT_USER'), accountController.deleteProductCategory);

// BRAND ROUTES
router.post('/brand', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.createBrand), accountController.createBrand);
router.get('/brands', auth('ACCOUNT_USER'), accountController.getAllBrands);
router.get('/brands/:brandId', auth('ACCOUNT_USER'), uploads.any(), accountController.getBrandById);
router.put('/brands/:brandId', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.updateBrand), accountController.updateBrand);
router.delete('/brands/:brandId', auth('ACCOUNT_USER'), accountController.deleteBrand);

// PRODUCT ROUTES
router.post('/product', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.createProduct), accountController.createProduct);
router.get('/products', auth('ACCOUNT_USER'), accountController.getAllProducts);
router.get('/products/:productId', auth('ACCOUNT_USER'), uploads.any(), accountController.getProductById);
router.put('/products/:productId', auth('ACCOUNT_USER'), uploads.any(), validate(accountValidation.updateProduct), accountController.updateProduct);
router.delete('/products/:productId', auth('ACCOUNT_USER'), accountController.deleteProduct);

// SUBSCRIPTION ROUTES
router.post('/subscription', auth('ACCOUNT_USER'), validate(accountValidation.createSubscription), accountController.createSubscription);
router.get('/subscriptions', auth('ACCOUNT_USER'), accountController.getAllSubscriptions);
router.get('/subscriptions/:subscriptionId', auth('ACCOUNT_USER'), accountController.getSubscriptionById);
router.put('/subscriptions/:subscriptionId', auth('ACCOUNT_USER'), validate(accountValidation.updateSubscription), accountController.updateSubscription);
router.delete('/subscriptions/:subscriptionId', auth('ACCOUNT_USER'), accountController.deleteSubscription);

// ASSIGN TRAINER TO MEMBER ROUTE
router.post('/assign-trainer', auth('ACCOUNT_USER'), accountController.assignTrainer);
router.get('/assigned-trainer/:memberId', auth('ACCOUNT_USER'), accountController.getAssignedTrainer);
router.put('/assign-trainer/:assignmentId', auth('ACCOUNT_USER'), accountController.updateAssignTrainer);
router.delete('/assign-trainer/:assignmentId', auth('ACCOUNT_USER'), accountController.deleteAssignTrainer);

// HEALTH REPORT ROUTE
router.post('/health-report', auth('ACCOUNT_USER'), validate(accountValidation.createHealthReport), accountController.createHealthReport);
router.get('/health-reports', auth('ACCOUNT_USER'), accountController.getHealthReport);
router.get('/health-reports/:reportId', auth('ACCOUNT_USER'), accountController.getHealthReportByID);
router.put('/health-reports/:reportId', auth('ACCOUNT_USER'), validate(accountValidation.updateHealthReport), accountController.updateHealthReport);
router.delete('/health-reports/:reportId', auth('ACCOUNT_USER'), accountController.deleteHealthReport);


module.exports = router;
