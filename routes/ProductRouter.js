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

      const newPath = await multiple(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    if (urls) {
      let body = req.body;
      let bodyw = _.extend(body, { files: urls });
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

router.get("/getall", async (req, res) => {
  try {
    const productsQuery = Product.find()
      .populate("sousCategorie", "name")
      .populate("categorie", "name");

    const limit = 12;

    const productsPromise = productsQuery.exec();
    const countPromise = Product.countDocuments().exec();

    const [products, count] = await Promise.all([
      productsPromise,
      countPromise,
    ]);

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      products,
      // currentPage: page,
      totalPages,
      totalItems: count,
    });
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

//update product cloudinary
router.patch(
  "/update/:ProductId",
  Upload.array("files", 6),
  async (req, res) => {
    if (req?.files?.length) {
      const files = req.files;
      let urls = [];
      let multiple = async (path) => await upload(path);
      for (const file of files) {
        const { path } = file;
        const newPath = await multiple(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      const isFilesArray = req.body.files instanceof Array;
      const newFiles = [
        ...urls,
        ...(isFilesArray ? req.body.files : [req.body.files]),
      ];
      var updates = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        sousCategorie: req.body.sousCategorie,
        categorie: req.body.categorie,
        countInStock: req.body.countInStock,
        files: newFiles.filter((item) => item !== undefined),
        specifications: req.body.specifications,
        discount: req.body.discount,
        features: req.body.features ? req.body.features : [],
        sku: req.body.sku,
        profit: req.body.profit,
      };
    } else {
      var updates = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        sousCategorie: req.body.sousCategorie,
        categorie: req.body.categorie,
        countInStock: req.body.countInStock,
        files: req.body.files,
        specifications: req.body.specifications,
        discount: req.body.discount,
        features: req.body.features,
        sku: req.body.sku,
        profit: req.body.profit,
      };
    }

    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.ProductId },
        {
          $set: updates,
        },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: err.message });
    }
  }
);

router.patch("/rate/:ProductId", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.ProductId },
      {
        $push: {
          rating: {
            rate: req.body.rating.rate,
            name: req.body.rating.name,
            email: req.body.rating.email,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err.message });
  }
});
module.exports = router;
