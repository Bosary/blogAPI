const { body, validationResult } = require("express-validator");

const Comment = require("../models/comment");
const Post = require("../models/post");

/**
 *  -------- GET Logic --------
 */

/**
 *  -------- POST Logic -------
 */

exports.createComments_POST = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape()
    .withMessage("Content must be specified"),

  // Process
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json({ error: errors });

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
    });

    await comment.save();

    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { commentsCount: 1 },
    });

    return res.json({ message: "Create comment success", comment });
  },
];
