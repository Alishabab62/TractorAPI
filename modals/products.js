const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  image: {
    type:String,
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  tractor: {
    type: String,
    required: true,
  },
  reviews: {
    type: [String],
  },
  discount: {
    type: Number,
  },
});

mongoose.set("strictQuery", false);
module.exports = mongoose.model("tractor/Product", ProductSchema);
