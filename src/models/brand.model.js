const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const brandSchema = mongoose.Schema(
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
    brand_name: {
      type: String,
      required: true,
      trim: true,
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
  {
    timestamps: true,
  }
);

brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
