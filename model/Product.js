const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique : false
  },
  sousCategorie: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Sous-Categorie",
    type:String,
    required:true,
  },
      categorie: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Sous-Categorie",
        type:String,
        required:true,
      },
  files:{
    type: []
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number, required: false, default: 0
  },
  countInStock: {
    type: Number, required: true, default: 0
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
