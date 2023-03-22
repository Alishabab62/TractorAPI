const express = require("express");
const router = express.Router();
const CartModel = require("../modals/addToCart");
const products = require("../modals/products");
const jwt = require("jsonwebtoken");
const { find } = require("../modals/products");
const secretKey = "secretKey";

router.post("/addtocart/:token", async (req, res) => {
  const token = req.params.token;
  try {
    jwt.verify(token, secretKey, async (error, authData) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid Token" });
      } else {
        try {
          const product = await products.findOne({ _id: req.body.product });
          const existingCart = await CartModel.findOne({
            user: authData.email,
          });

          if (!existingCart) {
            const newCart = new CartModel({
              user: authData.email,
              products: [product],
            });
            await newCart.save();
            await CartModel.findOneAndUpdate(
              { user: authData.email },
              { $addToSet: { product: product } },
              { upsert: true, new: true }
            );
          } else {
            await CartModel.findOneAndUpdate(
              { user: authData.email },
              { $addToSet: { product: product } },
              { upsert: true, new: true }
            );
          }
        } catch (error) {
          console.log(error);
        }
        res.status(200).json({ msg: "added" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/addtocart/get/:token/:user", async (req, res) => {
  const { token,user } = req.params;
  try {
    jwt.verify(token, secretKey, async (error, authData) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid Token" });
      } else {
        try {
          const product = await CartModel.findOne({user});
          res.status(200).json({ data: product });
        } catch (error) {
          console.log(error);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
