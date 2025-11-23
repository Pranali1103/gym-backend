const mongoose = require('mongoose');

const productCategorySchema = mongoose.Schema(
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
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    product_img: {
      type: String,
      default: null,
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


const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
module.exports = ProductCategory;
