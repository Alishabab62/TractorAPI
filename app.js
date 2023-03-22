const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const signUp = require("./router/signup");
const products = require('./router/product')
const wishlist = require("./router/wishlist");
const addToCart = require("./router/addToCart");

mongoose
  .connect(
    "mongodb+srv://alishabab62:alishabab6569@cluster0.udpfyhx.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", signUp);
app.use("/" , products);
app.use("/",wishlist);
app.use("/" , addToCart)



app.use((req, res) => {
  res.status(404).json({
    error: "bad request",
  });
});

module.exports = app;
