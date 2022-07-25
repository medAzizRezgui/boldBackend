const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true},
    percent: {type:Number , required: true,},
    isActive: { type: Boolean, require: true, default: true }
  },
  { timestamps: true }
);
module.exports = mongoose.model("discount_code", couponSchema);