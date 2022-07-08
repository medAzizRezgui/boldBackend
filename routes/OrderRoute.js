const express = require("express");
require("express-async-errors");
const router = express.Router();
const Order = require('../model/Order')

router.post('/addOrder', async (req,res)=>{
const {fullname,adresse,phoneNumber,Products} = req.body;
if (Products && Products.length === 0) {
  res.status(400).send("no orders items");
  // throw new Error('No oders items');
} else {
  const NewOrder = new Order({
    fullname,
    adresse,
    phoneNumber,
    Products,
  });
  const createdorder = await NewOrder.save();
  res.status(201).json(createdorder);
}
}
)