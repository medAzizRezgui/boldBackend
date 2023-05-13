const mongoose = require("mongoose");
const SousCategorie = require("./Sous-categorie");

const categorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, { timestamps: true });


// Middleware to delete subcategories when their parent category is deleted
categorieSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  const categoryId = this.getFilter()["_id"];
  // Delete the subcategories that reference the deleted category
  try {

  await SousCategorie.deleteMany({ categorie: categoryId  });
  }catch (e){
    console.log(e)
  }
  next();
});


module.exports = mongoose.model("Categorie", categorieSchema);
