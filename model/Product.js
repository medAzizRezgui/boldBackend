const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  sousCategorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sous-Categorie",
  },
  files:[{
    originalname:String,
  }],
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number, required: true, default: 0
  },
  countInStock: {
    type: Number, required: true, default: 0
  }
}, { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
