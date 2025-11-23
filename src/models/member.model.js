const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountBranch',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
     height: {
      type: Number,
      required: false,
      min: 0,
    },
    weight: {
      type: Number, 
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
//     trainer_id: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Trainer',
//   default: null,
// },

  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
