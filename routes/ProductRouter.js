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
const Upload = require('../utils/upload');
const upload = require("../helper/helper").upload;
const vm = require("v-response");
const _ = require("underscore");

//create product
router.post("/add", Upload.array("files",6), async (req, res,next) => {
  if (!req.files || _.isEmpty(req.files)) {
    return res.status(400)
        .json(vm.ApiResponse(false, 400, "No file uploaded'"))
}
const files = req.files;
try {
    let urls = [];
    let multiple = async (path) => await upload(path);
    for (const file of files) {
        const {path} = file;
        console.log("path", file);

        const newPath = await multiple(path);
        urls.push(newPath);
        fs.unlinkSync(path);
    }
    if (urls) {
        let body = req.body;
        let bodyw = _.extend(body, {files: urls});
        let new_Product = new Product(bodyw);
        await new_Product.save()
            .then(saved => {
                return res.json({saved});
            }).catch(error => {
                return res.json({msg : error.message});
            })

    }
    if (!urls) {
        return res.status(400)
            .json(vm.ApiResponse(false, 400, ""))
    }

} catch (e) {
    console.log("err :", e.message);
    return next(e);
}
});

router.post("/AddProd", Upload.array("files",6), async (req, res) => {
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
router.patch("/:ProductId",  Upload.array("files",6), async (req, res) => {
  

  if(req.files){
    let filesArray = [];
  req.files.forEach((element) => {
    const file = {
      originalname: element.originalname,
    };
    filesArray.push(file);
  }); 
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
// async function uploadToCloudinary(locaFilePath) {
  
//     // locaFilePath: path of image which was just
//     // uploaded to "uploads" folder
  
//     var mainFolderName = "main";
//     // filePathOnCloudinary: path of image we want
//     // to set when it is uploaded to cloudinary
//     var filePathOnCloudinary = 
//         mainFolderName + "/" + locaFilePath;
  
//     return cloudinary.uploader.upload(locaFilePath, { public_id: filePathOnCloudinary })
//         .then((result) => {
  
//             // Image has been successfully uploaded on
//             // cloudinary So we dont need local image 
//             // file anymore
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
  
//             return {
//                 message: "Success",
//                 url: result.url,
//             };
//         })
//         .catch((error) => {
  
//             // Remove file from local uploads folder
//             fs.unlinkSync(locaFilePath);
//             return { message: "Fail" };
//         });
// }
module.exports = router;
