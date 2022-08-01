const express = require("express");
require("express-async-errors");
const router = express.Router();
const discount = require("../model/discount")


router.post("/add", async (req, res) => {
  const data = new discount({
    name: req.body.name,
    percent: req.body.percent,
  });
  try {
    const saveddiscount = await data.save();
    res.status(200).send(saveddiscount);
  } catch (err) {
    res.status(400).send({ err });
  }
});



router.get("/:name", async (req, res) => {
  try {
    const pendingRequest = await discount.find({ name: req.params.name })
    res.status(200).json(pendingRequest);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await discount.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/enabled/:Id", async (req, res) => {
  try {
    const updateddiscount = await discount.updateOne(
      { _id: req.params.Id },
      { $set: { isActive: false } }
    );
    res
      .status(200)
      .send("updated :" + updateddiscount.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/abled/:Id", async (req, res) => {
  try {
    const updateddiscount = await discount.updateOne(
      { _id: req.params.Id },
      { $set: { isActive: true } }
    );
    res
      .status(200)
      .send("updated :" + updateddiscount.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;