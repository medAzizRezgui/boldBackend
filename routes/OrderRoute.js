const express = require("express");
require("express-async-errors");
const router = express.Router();
const Order = require("../model/Order");
const authenticateToken = require("../middleware/authenticateToken");
const authenticateTokenAdmin = require("../middleware/authenticateTokenAdmin");

router.post("/addOrder", authenticateToken, async (req, res) => {
  const { fullname, shippingAddress, phoneNumber, Products, email, coupon } =
    req.body;
  if (Products && Products.length === 0) {
    res.status(400).send("no orders items");
  } else {
    let som = 0;
    Products.forEach((element) => {
      som = som + element.item_price * element.qty;
    });
    const NewOrder = new Order({
      fullname,
      email,
      shippingAddress,
      phoneNumber,
      Products,
      totalPrice: som,
      coupon,
    });
    const createdOrder = await NewOrder.save();
    res.status(201).json(createdOrder);
  }
});

router.get("/getall", async (req, res) => {
  try {
    const data = await Order.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("no orders !!");
  }
});

router.get("/get/:orderId", async (req, res) => {
  try {
    const data = await Order.findById(req.params.orderId);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("order not found");
  }
});
router.get("/getByCoupon/:coupon", async (req, res) => {
  try {
    const coupon = req.params.coupon;
    const data = await Order.find({ coupon: coupon });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("Wrong Coupon");
  }
});

router.patch("/status/:orderId", authenticateTokenAdmin, async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (order) {
    order.status = req.body.status;
    order.updatedAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

router.patch("/pay/:orderId", authenticateToken, async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

router.delete("/delete/:orderId", authenticateTokenAdmin, async (req, res) => {
  try {
    const removedOrder = await Order.deleteOne({
      _id: req.params.orderId,
    });
    res.status(200).send("deleted");
    console.log(removedOrder);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

module.exports = router;
