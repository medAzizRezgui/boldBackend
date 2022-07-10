const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  shippingAddress: {
    region: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
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
      Product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
});

module.exports = mongoose.model("Orders", OrderSchema);
