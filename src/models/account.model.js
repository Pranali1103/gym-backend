const mongoose = require('mongoose');

const accountSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contact_info: {
      type: String,
      required: true,
      trim: true,
    },
    super_admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SuperAdmin', 
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
