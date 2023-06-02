const express = require("express");
require("express-async-errors");
const router = express.Router();
const categorie = require("../model/Categorie");

const authenticateTokenAdmin = require("../middleware/authenticateTokenAdmin");



// add CATEGORIE
router.post("/add",authenticateTokenAdmin, async (req, res) => {
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
    const categories = await categorie.find().populate(
        "name"
    );
    res.status(200).send(categories);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//get categorie by id
router.get("/:catId",async (req, res) => {
  try {
    const data = await categorie.findById(req.params.catId);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("categorie not found");
  }
});

//delete categorie
router.delete("/delete/:catId",authenticateTokenAdmin, async (req, res) => {
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
router.patch("/:catId",authenticateTokenAdmin,  async (req, res) => {
  try {
    const updatedCategorie = await categorie.updateOne(
      { _id: req.params.catId },
      { $set: { name: req.body.name } }
    );
    res
      .status(200)
      .send("updated :" + updatedCategorie.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
