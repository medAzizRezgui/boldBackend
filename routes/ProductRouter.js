const express = require("express");
require("express-async-errors");
require("dotenv").config();
const router = express.Router();
const Product = require("../model/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "./uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return "only image";
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: fileFilter,
}).array("files", 5);

//create product
router.post("/add", upload, async (req, res) => {
  let filesArray = [];
  req.files.forEach((element) => {
    const file = {
      originalname: element.originalname,
    };
    filesArray.push(file);
  });
  console.log(filesArray);
  const data = new Product({
    name: req.body.Name,
    sousCategorie: req.body.SousCategorie,
    files: filesArray,
    price: req.body.Price,
    countInStock: req.body.CountInStock,
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
    console.log(removedProduct);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//update product
router.patch("/:ProductId",  upload, async (req, res) => {
  let filesArray = [];
  req.files.forEach((element) => {
    const file = {
      originalname: element.originalname,
    };
    filesArray.push(file);
  });

  if(req.files){
    var updates={
      name: req.body.Name ,
      price: req.body.Price ,
      sousCategorie:req.body.SousCategorie,
      rating:req.body.Rating,
      countInStock:req.body.CountInStock,
      files:filesArray,
    }
  }else{
    var updates={
      name: req.body.Name ,
      price: req.body.Price ,
      sousCategorie:req.body.SousCategorie,
      rating:req.body.Rating,
      countInStock:req.body.CountInStock,
    }
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.ProductId },
      {
        $set: updates,
      },
      { new: true }
    );
    res.status(200).json({ msg: "updated" });
    console.log(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err.message });
  }
  // const { Name, Price, SousCategorie, Rating, CountInStock } = req.body;
  // const product = await Product.findById(req.params.ProductId);
  // if (product) {
  //   product.name = Name || product.name;
  //   product.price = Price || product.price;
  //   product.sousCategorie = SousCategorie || product.sousCategorie;
  //   product.rating = Rating || product.rating;
  //   product.countInStock = CountInStock || product.countInStock;
  //   if(req.files){
  //     product.files = filesArray ;
  //   }
  //   const updatedProduct = await product.save();
  //   res.json(updatedProduct);
  // } else {
  //   res.status(404);
  //   throw new Error("Product not found");
  // }
  

  
});

module.exports = router;
