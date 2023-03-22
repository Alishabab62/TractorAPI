const express = require("express");
const router = express.Router();
const WishlistModel = require("../modals/wishlist");
const products = require("../modals/products");
const jwt = require("jsonwebtoken");
const { find } = require("../modals/products");
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

router.put("/wishlist/update/:id/:productId", async (req, res) => {
  try {
    const wishlist = await WishlistModel.findById(req.params.id);
    const updatedProductIndex = wishlist.product.findIndex(
      (p) => p._id.toString() === req.params.productId.toString()
    );
    if (updatedProductIndex === -1) {
      return res.status(404).json({ msg: "Product not found in wishlist" });
    }
    const updatedProduct = { ...wishlist.product[updatedProductIndex], ...req.body };
    wishlist.product.set(updatedProductIndex, updatedProduct);
    const updatedWishlist = await wishlist.save();
    res.status(200).json(updatedWishlist.product[updatedProductIndex]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating product in wishlist");
  }
});





module.exports = router;