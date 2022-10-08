const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");
const { session } = require("passport");

/**
 * ------- GET Logic ----------
 */

exports.profile_GET = (req, res, next) => {
  return res.json({ message: "Success Profile Page" });
};

/**
 *  ------ POST Logic ---------
 */

exports.signup_POST = [
  // Validation and sanitation
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified"),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Password must contains at least 3 characters"),

  // Process
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json({ error: errors });

    User.findOne({ username: req.body.username }, async (err, found_user) => {
      if (err) return res.json({ error: err });

      if (found_user) return res.json({ message: "User already exist" });

      const user = await User.create(
        {
          username: req.body.username,
          password: req.body.password,
        },
        (err) => {
          if (err) return next(err);
        }
      );

      return res.json({ message: "SignUp Success", user });
    });
  },
];

exports.login_POST = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        err,
        user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.json(err);
      }

      const token = jwt.sign({ user }, "SECRET", { expiresIn: "5m" });
      return res.json({ user, token });
    });
  })(req, res);
};
