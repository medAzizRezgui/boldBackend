const express = require("express");
require("express-async-errors");
const router = express.Router();
const Order = require('../model/Order')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.post('/addOrder', async (req,res)=>{
const {fullname,shippingAddress,phoneNumber,Products,totalPrice} = req.body;
if (Products && Products.length === 0) {
  res.status(400).send("no orders items");
} else {
  const NewOrder = new Order({
    fullname,
    shippingAddress,
    phoneNumber,
    Products,
    totalPrice
  });
  const createdOrder = await NewOrder.save();
  res.status(201).json(createdOrder);
}
}
)

router.get("/getall", [auth],async (req, res) => {
  try {
    const data = await Order.find()
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("no orders !!");
  }
});


router.get("/get/:orderId",[auth], async (req, res) => {
  try {
    const data = await Order.findById(req.params.orderId)
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("order not found");
  }
});
 

router.patch("/deliver/:orderId",[auth],async (req,res)=>{
  const order = await Order.findById(req.params.orderId);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404)
    throw new Error('Order not found');
  }
})
router.patch("/pay/:orderId",[auth],async (req,res)=>{
  const order = await Order.findById(req.params.orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
})









module.exports = router;