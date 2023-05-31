const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    shippingAddress: {
      region: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: Number, required: true },
      street: { type: String, required: true },
    },
    phoneNumber: {
      type: Number,
      required: true,
      minlength: 8,
      maxlength: 12,
    },
    Products: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        item_price: { type: Number, required: true },
        image: { type: String, required: true },
        profit: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      value: { type: Number, required: false, default: 0 },
      label: { type: String, required: false, default: "Not Delivered" },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    coupon: {
      type: String,
      required: false,
    },
    finalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
