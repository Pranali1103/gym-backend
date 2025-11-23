const mongoose = require('mongoose');

const membershipPlanSchema = mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountBranch',
      required: true,
    },
    plan_name: {
      type: String,
      required: true,
      trim: true,
    },
    plan_type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ['FLAT', 'PERCENTAGE'],
      default: 'FLAT',
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);
module.exports = MembershipPlan;
