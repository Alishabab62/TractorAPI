const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../modals/products");
const { body, validationResult } = require("express-validator");

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

module.exports = router;
