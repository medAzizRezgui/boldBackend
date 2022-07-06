const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true,
  },
  sousCategorie :{
    type :mongoose.Schema.Types.ObjectId,
    ref : "Sous-Categorie",
  },
  price : {
    type : Number ,
    required : true,
  }
});

module.exports = mongoose.model("Product", ProductSchema);