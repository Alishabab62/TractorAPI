const express = require("express");
const router = express.Router();
const WishlistModel = require("../modals/wishlist");
const products = require("../modals/products");
const jwt = require("jsonwebtoken");
const { find } = require("../modals/products");
const { findByIdAndDelete } = require("../modals/wishlist");
const secretKey = "secretKey";

router.post("/wishlist/:token", async (req, res) => {
  const token = req.params.token;
  try {
    jwt.verify(token, secretKey, async (error, authData) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid Token" });
      } else {
        try {
          const product = await products.findOne({ _id: req.body.product });
          const existingWishlist = await WishlistModel.findOne({
            user: authData.email,
          });

          if (!existingWishlist) {
            const newWishlist = new WishlistModel({
              user: authData.email,
              products: [product],
            });
            await newWishlist.save();
            await WishlistModel.findOneAndUpdate(
              { user: authData.email },
              { $addToSet: { product: product } },
              { upsert: true, new: true }
            );
          } else {
            await WishlistModel.findOneAndUpdate(
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

router.get("/wishlist/get/:token/:user", async (req, res) => {
  const { token,user } = req.params;
  try {
    jwt.verify(token, secretKey, async (error, authData) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid Token" });
      } else {
        try {
          const product = await WishlistModel.findOne({user});
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

router.delete("/wishlist/update/:id/:productId", async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    let userWishlist = await WishlistModel.findById({ _id: userId });
    const updatedProductList = userWishlist.product.filter(
      (product) => product._id != productId
    ); 
    userWishlist.product = updatedProductList;
    await userWishlist.save(); 
    res.status(200).send("Product removed from wishlist");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating product in wishlist");
  }
});






module.exports = router;
