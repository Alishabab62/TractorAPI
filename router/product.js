const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../modals/products");
const { body, validationResult } = require("express-validator");
const products = require("../modals/products");
const { findByIdAndUpdate } = require("../modals/products");


// for posting products

router.post("/upload", async (req, res) => {
    try {
      const newImage = new Product(req.body);

      await newImage.save();
      res.status(200).json({ message: "added Successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// for getting all products

router.get("/get/products", async (req, res) => {
  try {
    const data = await Product.find();
    res.status(200).json({ products:data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



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





