const mongoose = require('mongoose');
// const { toJSON, paginate } = require('./plugins');

const trainerSchema = mongoose.Schema(
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
     dob: {
      type: Date,
      required: false,
    },
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: false,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      required: false,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    specialization: {
      type: [String],
      trim: true,
      default: [],
    },
       height: {
      type: Number, // in cm
      required: false,
      min: 0,
    },
    weight: {
      type: Number, // in kg
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// plugins
// trainerSchema.plugin(toJSON);
// trainerSchema.plugin(paginate);

const Trainer = mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
