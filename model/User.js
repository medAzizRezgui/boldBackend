const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 10,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      region: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: Number, required: false },
      street: { type: String, required: false },
    },
  },
  { timestamps: true }
);

userSchema.methods.generateTokens = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.ACCES_TOKEN,
    {
      expiresIn: process.env.JWT_EXP,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
