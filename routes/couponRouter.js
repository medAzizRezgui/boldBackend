const express = require("express");
require("express-async-errors");
const router = express.Router();
const coupon = require("../model/Coupon")


router.post("/add", async (req, res) => {
  const data = new coupon({
    owner: req.body.owner,
    code: req.body.code,
  });
  try {
    const saveCoupon = await data.save();
    res.status(200).send(saveCoupon);
  } catch (err) {
    res.status(400).send(err.message);
  }
});



router.get("/:code", async (req, res) => {
  try {
    const pendingRequest = await coupon.find({ code: req.params.code })
    res.status(200).json(pendingRequest);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await coupon.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/disable/:Id", async (req, res) => {
  try {
    const updateCoupon = await coupon.updateOne(
      { _id: req.params.Id },
      { $set: { isActive: false } }
    );
    res
      .status(200)
      .send("updated :" + updateCoupon.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/enable/:Id", async (req, res) => {
  try {
    const updateCoupon = await coupon.updateOne(
      { _id: req.params.Id },
      { $set: { isActive: true } }
    );
    res
      .status(200)
      .send("updated :" + updateCoupon.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
