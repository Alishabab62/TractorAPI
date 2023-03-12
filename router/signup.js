const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SignUp = require("../modals/signUp");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const user = await SignUp.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    } else {
      const user = new SignUp(req.body);
      console.log(user);
      await user
        .save()
        .then((result) => {
          res.status(200).json({ user: result });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/login/:email", async (req, res) => {
  await SignUp.find({ email: req.params.email })
    .then((user) => {
      res.status(200).json({ user: user });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
