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
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isCanceled: {
      type: Boolean,
      required: false,
      default: false,
    },
    canceledAt: {
      type: Date,
    },
    coupon: {
      type: String,
      required: false,
      default: "0",
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
