const express = require("express");
require("express-async-errors");
const router = express.Router();
const categorie = require("../model/Categorie");

// add CATEGORIE
router.post("/add", async (req, res) => {
  const data = new categorie({
    name: req.body.name,
  });
  try {
    const savedCategorie = await data.save();
    res.status(200).send(savedCategorie);
  } catch (err) {
    res.status(400).send({ err });
  }
});

//get all categorie
router.get("/getall", async (req, res) => {
  try {
    const data = await categorie.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//get categorie by id
router.get("/:catId", async (req, res) => {
  try {
    const data = await categorie.findById(req.params.catId);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("categorie not found");
  }
});

//delete categorie
router.delete("/delete/:catId", async (req, res) => {
  try {
    const removedCategorie = await categorie.deleteOne({
      _id: req.params.catId,
    });
    res.status(200).send(removedCategorie);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//update categorie
router.patch("/:catId", async (req, res) => {
  try {
    const updatedCategorie = await categorie.updateOne(
      { _id: req.params.catId },
      { $set: { name: req.body.name } }
    );
    res
      .status(200)
      .send("updated :" + updatedCategorie.acknowledged);
  } catch (err) {
    res.status(400).send({ message: err });
    console.log("mochkel fel update");
  }
});

module.exports = router;
