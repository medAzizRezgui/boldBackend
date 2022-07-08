const express = require("express");
require("express-async-errors");
require("dotenv").config();
const router = express.Router();
const SousCategorie = require("../model/Sous-categorie");

router.post("/add", async (req, res) => {
  const data = new SousCategorie({
    name: req.body.name,
    categorie: req.body.categorie,
  });
  try {
    const savedSousCategorie = await data.save();
    console.log(savedSousCategorie);
    res.status(200).send(savedSousCategorie);
  } catch (err) {
    console.log({ err });
    res.status(400).send({ err });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const SousCategories = await SousCategorie.find().populate(
      "categorie",
      "name"
    );
    res.status(200).send(SousCategories);
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.delete("/delete/:SousCategorieId", async (req, res) => {
  try {
    const removedSousCategorie = await SousCategorie.deleteOne({
      _id: req.params.SousCategorieId,
    });
    res.status(200).send(removedSousCategorie);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.patch("/:souscatId", async (req, res) => {
  try {
    const updatedSousCategorie = await categorie.updateOne(
      { _id: req.params.souscatId },
      { $set: { name: req.body.name } }
    );
    res
      .status(200)
      .send("updated successfully :" + updatedSousCategorie.acknowledged);
  } catch (err) {
    res.status(400).send({ message: err });
    console.log("mochkel fel update");
  }
});

module.exports = router;
