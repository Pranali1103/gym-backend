const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
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
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    membershipplan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    start_date: {
  type: Date,
  required: true,
},
end_date: {
  type: Date,
  required: true,
},
    // Payment metadata
    payment_mode: {
      type: String,
      enum: ['CARD', 'ONLINE','UPI'],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ['SUCCESS','PENDING', 'PAID', 'FAILED'],
      default: 'SUCCESS',
    },
    transaction_id: {
      type: String,
      default: null,
    },
    payment_date: {
      type: Date,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);


const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
