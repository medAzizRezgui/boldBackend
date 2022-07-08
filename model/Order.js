const mongoose = require("mongoose");
const Product = require("./Product");

const OrderSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  adresse:{
    type: String,
    required: true,
  },
  phoneNumber:{
    type :Number ,
    required: true,
    minlength: 8,
    maxlength: 12,
  },
  Products : [ 
    {
    Product :{type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'},
}
],

});

module.exports = mongoose.model("Orders", OrderSchema);
