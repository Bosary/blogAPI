const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
