const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    sousCategorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sous-Categorie",
      required: true,
    },
    files: {
      type: [],
    },
    sku: {
      type: String,
      required: true,
    },
    features: {
      type: [],
      required: false,
    },
    specifications: {
      type: String,
      required: true,
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: [
      {
        type: Number,
        default: 0,
      },
    ],

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
