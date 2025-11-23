const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const productSchema = mongoose.Schema(
  {
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // branch_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AccountBranch",
    //   default: null,
    // },
    product_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

// slug creation before saving
productSchema.pre("save", function (next) {
  if (this.product_name) {
    this.slug = this.product_name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
