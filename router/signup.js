const express = require("express");
const router = express.Router();
const User = require("../modals/signUp");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const secretKey = "secretKey"

router.post("/signup", async (req, res) => {
  try {
    const { fname, mname, lname, email, phone, dob, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create a new user
    const user = new User({
      fname,
      mname,
      lname,
      email,
      phone,
      dob,
      password,
    });

    await user.save().then((data)=>{
      res.status(201).json({ message: "User created successfully" , data:data});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
    jwt.sign(req.body,secretKey,{expiresIn:"300s"},(err,token)=>{
      if(err){
        console.log(err)
      }
      res
        .status(200)
        .json({data:{id: user._id ,token:token,user:user.fname , email:user.email}});
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
