const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SignUp = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  mname: {
    type: String,
    required: false,
  },
  lname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: function (value) {
      return bcrypt.hashSync(value, 10);
    },
  },
});
mongoose.set("strictQuery", false);
module.exports = mongoose.model("tractor/signup", SignUp);
