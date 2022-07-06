const express = require("express");
require("express-async-errors");
require("dotenv").config();
const router = express.Router();
const Product = require('../model/Product')


router.post("/add", async (req, res) => {
  const data = new Product({
    name :req.body.name,
    sousCategorie :req.body.sousCategorie,
    price : req.body.price,
  });
  try {
    const savedProduct = await data.save();
    console.log(savedProduct);
    res.status(200).send(savedProduct);
  } catch (err) {
    console.log({ err });
    res.status(400).send({ err });
  }
});


router.get("/getall", async (req, res) => {
    try {
      const Products = await Product.find().populate("sousCategorie","name")
      res.status(200).send(Products);
    } catch (err) {
      res.status(400).send({err});
    }
  });

  router.get("/:ProdId", async (req, res) => {
    try {
      const data = await Product.findById(req.params.ProdId).populate("sousCategorie", "name");
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send("product not found");
    }
  });


  router.delete('/delete/:ProductId',async (req,res)=>{
    try{
     const removedProduct = await Product.deleteOne({_id : req.params.ProductId});
     res.status(200).send("deleted");
    }catch(err){
      res.status(400).send({message : err});
    }
    });

    router.patch('/:ProductId',async (req,res)=>{
        try{
        const updatedProduct = await Product.updateOne({_id : req.params.ProductId},{$set :{price :req.body.price,name :req.body.name}});
        res.status(200).send('updated successfully : '+ updatedProduct.acknowledged);
        console.log(updatedProduct)
        }catch(err){
          res.status(400).send({message : err});
        }
      })
module.exports = router;
