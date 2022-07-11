const express = require("express");
require("express-async-errors");
const router = express.Router();
const Order = require('../model/Order')

router.post('/addOrder', async (req,res)=>{
const {fullname,shippingAddress,phoneNumber,Products} = req.body;
if (Products && Products.length === 0) {
  res.status(400).send("no orders items");
} else {
  const NewOrder = new Order({
    fullname,
    shippingAddress,
    phoneNumber,
    Products,
  });
  const createdorder = await NewOrder.save();
  res.status(201).json(createdorder);
}
}
)

router.get("/getall", async (req, res) => {
  try {
    const data = await Order.find()
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("no orders !!");
  }
});


router.get("/:orderId", async (req, res) => {
  try {
    const data = await Order.findById(req.params.orderId)
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("order not found");
  }
});
 

router.patch("/updateDelevryStat/orderId",async (req,res)=>{
  const order = await Order.findById(req.params.orderId);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).send('order not found');
  }
})




























module.exports = router;