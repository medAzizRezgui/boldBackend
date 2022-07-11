const express = require("express");
require("express-async-errors");
require("dotenv").config();
const router = express.Router();
const Product = require("../model/Product");
const multer = require("multer");
const fs = require('fs')
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir ="./uploads/";
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir)
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null
      // , file.originalname
      ,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png"|| file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
    return "only image"
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: fileFilter,
}).array('files',5);

//create product
router.post("/add",upload, async (req, res) => {
  let filesArray = [];
  req.files.forEach(element => {
    const file = {
        originalname: element.originalname
    }
    filesArray.push(file);
});
console.log(filesArray);
  const data = new Product({
    name: req.body.name,
    sousCategorie: req.body.sousCategorie,
    files: filesArray,
    price: req.body.price,
  });
  try {
    const savedProduct = await data.save();
    console.log(savedProduct);
    res.status(200).send(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).send({ err });
  }
});

//get all product
router.get("/getall", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const Products = await Product.find()
      .populate("sousCategorie", "name")
      .limit(limit * 1)
      .skip(page - 1);
    res.status(200).send(Products);
  } catch (err) {
    res.status(400).send({ err });
  }
});

//get Product by id
router.get("/:ProdId", async (req, res) => {
  try {
    const data = await Product.findById(req.params.ProdId).populate(
      "sousCategorie",
      "name"
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("product not found");
  }
});

//delete produt
router.delete("/delete/:ProductId", async (req, res) => {
  try {
    const removedProduct = await Product.deleteOne({
      _id: req.params.ProductId,
    });
    res.status(200).send("deleted");
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//update product
router.patch("/:ProductId", async (req, res) => {
  try {
    const updatedProduct = await Product.updateOne(
      { _id: req.params.ProductId },
      { $set: { price: req.body.price , name: req.body.name  ,sousCategorie:req.body.sousCategorie, files :req.files} }
    );
    res.status(200).send("updated  : " + updatedProduct.acknowledged);
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: err });
  }
});
module.exports = router;
