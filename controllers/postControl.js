const async = require("async");
const sharp = require("sharp");
const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const Comments = require("../models/comment");

const S3 = require("../config/s3");
/**
 * ------- GET Logic ----------
 */

exports.allPosts_GET = async (req, res, next) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "username");
  // .exec(async function (err) {
  //   if (err) {
  //     return next(err);
  //   }

  for (let post of posts) {
    post.imageUrl = await S3.getObjectSignedUrl(post.imageName);
  }

  res.json({ posts, message: "All posts" });
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
          .sort({ likes: -1, createdAt: -1 })
          .exec(cb);
      },
    },
    async function (err, results) {
      if (err) return next(err);

      if (results.post == null) {
        return res.status(404).send("Post not found");
      }

      // Success
      results.post.imageUrl = await S3.getObjectSignedUrl(
        results.post.imageName
      );

      res.json({
        message: "SinglePost get",
        post: results.post,
        comments: results.comments,
      });
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

  async (req, res, next) => {
    // Verification Process
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send(errors);

    /* Image process */
    // multer
    const file = req.file;
    const imageName = file.filename + "-" + Date.now().toString();

    // re-sizing image
    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 720, width: 1280, fit: "contain" })
      .toBuffer();

    // upload to s3
    await S3.uploadFile(fileBuffer, imageName, file.mimetype);

    // upload to db
    Post.create(
      {
        title: req.body.title,
        imageName: imageName,
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

exports.deletePost = async (req, res, next) => {
  const id = req.params.postId;

  const post = await Post.findByIdAndDelete({ _id: id });

  if (!post) return res.json("message: post not found");
  await S3.deleteFile(post.imageName);

  res.json({ message: "delete post success" });
};
