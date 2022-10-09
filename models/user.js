const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * ---------- Schema ---------
 */
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
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  isAdmin: { type: Boolean, default: false },
});

/**
 *  ------- Password Crypt & Check ---------
 */
userSchema.pre("save", async function (next) {
  const hashed = await bcrypt.hash(this.password, 10);

  this.password = hashed;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 *  -------- JWT Token ----------
 */
userSchema.methods.generateToken = function () {
  const payloadObj = {
    sub: this._id,
    name: this.username,
    admin: this.isAdmin,
  };

  return jwt.sign(payloadObj, "SECRET", { expiresIn: "1d" });
};

/**
 *  --------- Model ---------
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
