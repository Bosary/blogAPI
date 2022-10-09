const express = require("express");
const passport = require("passport");
const router = express.Router();

const PostControl = require("../controllers/postControl");
const CommentControl = require("../controllers/commentsControl");
const checkAdmin = require("../config/admin").checkAdmin;

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
  passport.authenticate("jwt", { session: false }),
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

router.delete("/:postId");

module.exports = router;
