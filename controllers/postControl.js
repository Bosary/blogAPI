const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const Comments = require("../models/comment");
const async = require("async");

/**
 * ------- GET Logic ----------
 */

exports.hotPosts_get = (req, res, next) => {
  Post.find({ likes: { $gte: 50 } })
    .sort({ createdAt: -1 })
    .populate("author", "username")
    .exec((err, all_posts) => {
      if (err) return next(err);

      res.json({ all_posts, message: "Hot posts" });
    });
};

exports.freshPosts_get = (req, res, next) => {
  Post.find({ likes: { $lt: 50 } })
    .sort({ createdAt: -1 })
    .populate("author", "username")
    .exec((err, all_posts) => {
      if (err) return next(err);

      res.json({ all_posts, message: "Fresh posts" });
    });
};

exports.singlePost_get = (req, res, next) => {
  async.parallel(
    {
      post: function (cb) {
        Post.findById(req.params.postId)
          .populate("author", "username")
          .exec(cb);
      },

      comments: function (cb) {
        Comments.find({ post: req.params.postId })
          .populate("author", "username")
          .sort({ likes: -1 })
          .exec(cb);
      },
    },
    function (err, results) {
      if (err) return next(err);

      if (results.post == null) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Success
      res.json({ message: "SinglePost get", results });
    }
  );
};

/**
 *  ------ POST Logic ---------
 */

exports.create_POST = [
  // Validation and sanitation
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified"),
  body("bodyURL")
    .trim()
    // .escape()  Temporaly remove until I figure out how to upload image
    .custom((url) => {
      const extension = url.split(".").pop();
      switch (extension) {
        case "jpg":
          return true;
        case "jpeg":
          return true;
        case "gif":
          return true;
        case "png":
          return true;
        default:
          return false;
      }
    })
    .withMessage("Valid URL must be specified"),

  // Process
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json({ error: errors });

    Post.create(
      {
        title: req.body.title,
        bodyURL: req.body.bodyURL,
        author: req.user._id,
      },
      (err, post) => {
        if (err) return next(err);

        return res.json({ message: "Create Post success", post });
      }
    );
  },
];

/**
 * -------- PUT Logic -----------
 */

exports.like_PUT = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postId, { $inc: { likes: 1 } }),
    (err) => {
      if (err) return next(err);

      return res.json({ message: "Sucess likes" });
    };
};

exports.dislike_PUT = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postId, { $inc: { likes: -1 } }),
    (err) => {
      if (err) return next(err);

      return res.json({ message: "Sucess dislikes" });
    };
};

/**
 * -------- DELETE Logic ---------
 */

exports.deletePost = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId, (err) => {
    if (err) return next(err);

    res.json({ message: "delete post success" });
  });
};
