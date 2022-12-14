const express = require("express");
const passport = require("passport");
const router = express.Router();

const UserControl = require("../controllers/userControl");

/**
 *  ------- GET ----------
 */
router.get("/", (req, res) => {
  res.json({ message: "Hello from user!" });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  UserControl.profile_GET
);

router.get("/:userId", UserControl.user_detail_GET);

/**
 *  ------- POST --------
 */
router.post("/signup", UserControl.signup_POST);

router.post("/login", UserControl.login_POST);

/*
---Need to check how to destroy jwt token on logout---

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  UserControl.logout_POST
);
*/

module.exports = router;
