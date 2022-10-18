/* Express */
const express = require("express");
const passport = require("passport");
const router = express.Router();

/* Controller */
const PostControl = require("../controllers/postControl");
const CommentControl = require("../controllers/commentsControl");

/* Config */
const checkAdmin = require("../config/admin").checkAdmin;
const upload = require("../config/multer");
/**
 * ------------ GET -------------
 */

router.get("/", PostControl.allPosts_GET);

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
