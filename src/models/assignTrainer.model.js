const mongoose = require('mongoose');

const assignTrainerSchema = new mongoose.Schema({
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
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // person who made assignment
  },
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'COMPLETED'],
    default: 'ACTIVE',
  },
}, { timestamps: true });

const AssignTrainer = mongoose.model('AssignTrainer', assignTrainerSchema);
module.exports = AssignTrainer;
