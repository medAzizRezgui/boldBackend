const mongoose = require("mongoose");

const SousCategorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
    required: true
  },
}, { timestamps: true });


module.exports = mongoose.model("Sous-Categorie", SousCategorieSchema);
