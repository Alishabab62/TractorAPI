const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    product: {
      type: [Object],
    },
  });
  
  mongoose.set("strictQuery", false);
  module.exports = mongoose.model("tractor/wishlist", WishlistSchema);