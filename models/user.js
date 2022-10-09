const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
 *  --------- Model ---------
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
