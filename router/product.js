const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../modals/products");
const { body, validationResult } = require("express-validator");
const products = require("../modals/products");
const { findByIdAndUpdate } = require("../modals/products");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  path: (req, file, cb) => {
    cb(null, path.join("uploads", file.originalname));
  },
});

const upload = multer({ storage: Storage }).single("image");
  
// for posting products

router.post(
  "/upload",
  upload,
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image file is required");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newImage = new Product({
      image: {
        data: req.file.filename,
        contentType: "image/jpg",
      },
      name:req.body.name,
      price:req.body.price,
      description:req.body.description,
      brand:req.body.brand,
      tractor:req.body.tractor,
      reviews:req.body.reviews,
      discount:req.body.discount,
      productId:req.body.productId
    });
    try {
      const savedImage = await newImage.save();
      res.json(savedImage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// for getting all products

try{
  router.get("/get/products" , async(req,res)=>{
    const data = await products.find();
    res.status(200).json({data:data})
  })
}
catch(error){
  console.log(error)
}


router.post("/product/:_id/reviews", async (req, res) => {
  const { _id } = req.params;
  const { review } = req.body;
  
  try {
    const product = await Product.findOneAndUpdate(
      { _id },
      { $push: { reviews: review } },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Review added for product with ID: ${_id}`,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
    });
  }
});


module.exports = router;
