const express = require("express");
const passport = require("passport");
const router = express.Router();

const PostControl = require("../controllers/postControl");

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
  "/create",
  passport.authenticate("jwt", { session: false }),
  PostControl.create_POST
);

module.exports = router;
