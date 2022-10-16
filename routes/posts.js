const express = require("express");
const passport = require("passport");
const multer = require("multer");
const router = express.Router();

const PostControl = require("../controllers/postControl");
const CommentControl = require("../controllers/commentsControl");
const checkAdmin = require("../config/admin").checkAdmin;

/**
 *  -------------- Multer Config ---------
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid format"), false);
  }
};

const upload = multer({
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
  storage: storage,
});

/**
 * ------------ GET -------------
 */

router.get("/", PostControl.hotPosts_get);

router.get("/fresh", PostControl.freshPosts_get);

router.get("/:postId", PostControl.singlePost_get);

/**
 * ---------- POST -----------
 */

router.post(
  "/new_post",
  [passport.authenticate("jwt", { session: false }), upload.single("image")],
  PostControl.create_POST
);

router.post(
  "/:postId/new_comment",
  passport.authenticate("jwt", { session: false }),
  CommentControl.createComments_POST
);

/**
 * -------- PUT -----------
 */

router.put("/:postId/like", PostControl.like_PUT);

router.put("/:postId/dislike", PostControl.dislike_PUT);

/**
 *  -------- DELETE --------
 */
router.delete(
  "/:postId/comment/:commentId",
  [passport.authenticate("jwt", { session: false }), checkAdmin],
  CommentControl.deleteComment
);

router.delete(
  "/:postId",
  [passport.authenticate("jwt", { session: false }), checkAdmin],
  PostControl.deletePost
);

module.exports = router;
