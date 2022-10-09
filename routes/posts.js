const express = require("express");
const passport = require("passport");
const router = express.Router();

const PostControl = require("../controllers/postControl");
const CommentControl = require("../controllers/commentsControl");

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
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  CommentControl.createComments_POST
);

module.exports = router;
