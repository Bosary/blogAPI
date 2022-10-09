const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, minLength: 1, maxLength: 500 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentsSchema);
