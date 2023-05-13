const express = require("express");
require("express-async-errors");
require("dotenv").config();
const router = express.Router();
const Product = require("../model/Product");
const fs = require("fs");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Upload = require("../utils/upload");
const upload = require("../helper/helper").upload;
const vm = require("v-response");
const _ = require("underscore");

//create product
router.post("/add", Upload.array("files", 6), async (req, res, next) => {
  if (!req.files || _.isEmpty(req.files)) {
    return res
      .status(400)
      .json(vm.ApiResponse(false, 400, "No file uploaded'"));
  }
  const files = req.files;
  try {
    let urls = [];
    let multiple = async (path) => await upload(path);
    for (const file of files) {
      const { path } = file;
      console.log("path", file);

      const newPath = await multiple(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    if (urls) {
      let body = req.body;
      let bodyw = _.extend(body, { files : urls });
      let new_Product = new Product(bodyw);
      await new_Product
        .save()
        .then((saved) => {
          return res.json({ saved });
        })
        .catch((error) => {
          return res.json({ msg: error.message });
        });
    }
    if (!urls) {
      return res.status(400).json(vm.ApiResponse(false, 400, ""));
    }
  } catch (e) {
    console.log("err :", e.message);
    return next(e);
  }
});

router.post("/AddProd", Upload.array("files", 6), async (req, res) => {
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
      .populate("sousCategorie", "name").populate("categorie","name")
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
router.patch("/:ProductId", Upload.array("files", 6), async (req, res) => {

  if (req.files.length > 0) {
    let filesArray = [];
    req.files.forEach((element) => {
      const file = {
        originalname: element.originalname,
      };
      filesArray.push(file);
    });
    var updates = {
      name: req.body.name,
      price: req.body.price,
      sousCategorie: req.body.sousCategorie,
      rating: req.body.rating,
      countInStock: req.body.countInStock,
      files: filesArray,
    };
  } else {
    var updates = {
      name: req.body.name,
      price: req.body.price,
      sousCategorie: req.body.sousCategorie,
      rating: req.body.rating,
      countInStock: req.body.countInStock,
    };
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.ProductId },
      {
        $set: updates,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err.message });
  }
});


//update product cloudinary
router.patch("/update/:ProductId", Upload.array("files", 6), async (req, res) => {
  if (req.files.length > 0) {
    const files = req.files;
      let urls = [];
      let multiple = async (path) => await upload(path);
      for (const file of files) {
        const { path } = file;
        console.log("path", file);
        const newPath = await multiple(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      var updates = {
        name: req.body.name,
        price: req.body.price,
        description:req.body.description,
        sousCategorie: req.body.sousCategorie,
        rating: req.body.rating,
        countInStock: req.body.countInStock,
        files: urls,
      }
      console.log(urls)
    }else{
      var updates = {
        name: req.body.name,
        price: req.body.price,
        description:req.body.description,
        sousCategorie: req.body.sousCategorie,
        rating: req.body.rating,
        countInStock: req.body.countInStock}
    }
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.ProductId },
      {
        $set: updates,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;

