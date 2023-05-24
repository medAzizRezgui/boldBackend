const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    owner: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    percent: { type: Number, required: false },
    isActive: { type: Boolean, require: false, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
