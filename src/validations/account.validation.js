const Joi = require('joi');
const { objectId } = require("./custom.validation");


  //  TRAINER VALIDATION
   
const createTrainer = {
  body: Joi.object().keys({
    // account_id and user_id will be fetched from token/user context
    branch_id: Joi.string().required(),
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string().email().required(),
    specialization: Joi.array().items(Joi.string()).default([]),
    dob: Joi.date().optional(),
    blood_group: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
      .optional(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    height: Joi.number().min(50).max(300).optional().messages({
      'number.base': 'Height must be a number',
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height cannot exceed 300 cm',
    }),
    weight: Joi.number().min(20).max(300).optional().messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight must be at least 20 kg',
      'number.max': 'Weight cannot exceed 300 kg',
    }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
  }),
};

const updateTrainer = {
  params: Joi.object().keys({
    trainerId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      email: Joi.string().email().optional(),
      specialization: Joi.array().items(Joi.string()).optional(),
      dob: Joi.date().optional(),
      blood_group: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .optional(),
      gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
      height: Joi.number().min(50).max(300).optional(),
      weight: Joi.number().min(20).max(300).optional(),
      status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
    })
    .min(1),
};

  //  MEMBER VALIDATION
  
const createMember = {
  body: Joi.object().keys({
    // account_id and user_id will be fetched from backend
    branch_id: Joi.string().required(),
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    dob: Joi.date().required(),
    blood_group: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
      .optional(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
    address: Joi.string().required(),
    street: Joi.string().required(),
    area: Joi.string().required(),
    zipcode: Joi.string().required(),
    height: Joi.number().min(50).max(300).optional().messages({
      'number.base': 'Height must be a number',
      'number.min': 'Height must be at least 50 cm',
      'number.max': 'Height cannot exceed 300 cm',
    }),
    weight: Joi.number().min(20).max(300).optional().messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight must be at least 20 kg',
      'number.max': 'Weight cannot exceed 300 kg',
    }),
  }),
};

const updateMember = {
  params: Joi.object().keys({
    memberId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      dob: Joi.date().optional(),
      blood_group: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .optional(),
      gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
      address: Joi.string().optional(),
      street: Joi.string().optional(),
      area: Joi.string().optional(),
      zipcode: Joi.string().optional(),
      branch_id: Joi.string().optional(),
      height: Joi.number().min(50).max(300).optional(),
      weight: Joi.number().min(20).max(300).optional(),
    })
    .min(1),
};

// const assignTrainerToMember = {
//   body: Joi.object().keys({
//     member_id: Joi.string().required(),
//     trainer_id: Joi.string().required(),
//   }),
// };


  //  MEMBERSHIP PLAN VALIDATION
const createMembershipPlan = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    plan_name: Joi.string().required(),
    plan_type: Joi.string().required(),
    description: Joi.string().optional(),
    duration: Joi.number().required(),
    price: Joi.number().required(),
    discount_type: Joi.string().valid('FLAT', 'PERCENTAGE').optional(),
    discount: Joi.number().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
  }),
};

const updateMembershipPlan = {
  params: Joi.object().keys({
    planId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      branch_id: Joi.string().optional(),
      plan_name: Joi.string().optional(),
      plan_type: Joi.string().optional(),
      description: Joi.string().optional(),
      duration: Joi.number().optional(),
      price: Joi.number().optional(),
      discount_type: Joi.string().valid('FLAT', 'PERCENTAGE').optional(),
      discount: Joi.number().optional(),
      status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
    })
    .min(1),
};


  //  PRODUCT CATEGORY VALIDATION
const createProductCategory = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    product_name: Joi.string().required(),
    product_img: Joi.string().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
  }),
};

const updateProductCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      branch_id: Joi.string().optional(),
      product_name: Joi.string().optional(),
      product_img: Joi.string().optional(),
      status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
    })
    .min(1),
};

  //  BRAND VALIDATION

const createBrand = {
  body: Joi.object().keys({
    brand_name: Joi.string().required(),
    status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  }),
};

const updateBrand = {
  body: Joi.object()
    .keys({
      brand_name: Joi.string(),
      status: Joi.string().valid("ACTIVE", "INACTIVE"),
    })
    .min(1),
};

  //  PRODUCT VALIDATION

const createProduct = {
  body: Joi.object().keys({
    branch_id: Joi.string().optional().custom(objectId),
    product_category_id: Joi.string().required().custom(objectId),
    brand_id: Joi.string().required().custom(objectId),
    product_name: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    price: Joi.number().required(),
    discount: Joi.number().optional(),
    stock: Joi.number().optional(),
    status: Joi.string().valid("ACTIVE", "INACTIVE"),
  }),
};

const updateProduct = {
  body: Joi.object()
    .keys({
      branch_id: Joi.string().optional().custom(objectId),
      product_category_id: Joi.string().optional().custom(objectId),
      brand_id: Joi.string().optional().custom(objectId),
      product_name: Joi.string().optional(),
      description: Joi.string().allow(null, ""),
      price: Joi.number().optional(),
      discount: Joi.number().optional(),
      stock: Joi.number().optional(),
      status: Joi.string().valid("ACTIVE", "INACTIVE"),
    })
    .min(1),
};

// SUBSCRIPTION VALIDATION

const createSubscription = {
  body: Joi.object().keys({
    branch_id: Joi.string().required(),
    member_id: Joi.string().required(),
    membershipplan_id: Joi.string().required(),
    payment_mode: Joi.string().valid('CARD', 'ONLINE', 'UPI').required(),
    amount: Joi.number().required(),
  }),
};

const updateSubscription = {
  body: Joi.object()
    .keys({
      branch_id: Joi.string().optional(),
      member_id: Joi.string().optional(),
      membershipplan_id: Joi.string().optional(),
      payment_mode: Joi.string().valid('CARD', 'ONLINE', 'UPI').optional(),
      amount: Joi.number().optional(),
      payment_status: Joi.string()
        .valid('SUCCESS','PENDING', 'PAID', 'FAILED')
        .optional(),
      status: Joi.string().valid('ACTIVE', 'EXPIRED', 'CANCELLED').optional(),
    })
    .min(1), 
};

const updateAssignTrainer = {
  params: Joi.object().keys({
    assignmentId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('ACTIVE', 'INACTIVE'),
      end_date: Joi.date().optional(),
      notes: Joi.string().optional(),
    })
    .min(1),
};


  // EXPORT 

module.exports = {
  // Trainer 
  createTrainer,
  updateTrainer,

  // Member 
  createMember,
  updateMember,

  // Membership Plan
  createMembershipPlan,
  updateMembershipPlan,

  // Product Category
  createProductCategory,
  updateProductCategory,

  // Brand
  createBrand,
  updateBrand,

  // Product
  createProduct,
  updateProduct,

  // Subscription
  createSubscription,
  updateSubscription,

  // Assign Trainer to Member
  updateAssignTrainer,
};
