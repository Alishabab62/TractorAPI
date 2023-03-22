const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    product: {
      type: [Object],
    },
  });
  
  mongoose.set("strictQuery", false);
  module.exports = mongoose.model("tractor/cart", CartSchema);