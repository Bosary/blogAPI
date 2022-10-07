const { body, validationResult } = require("express-validator");

const User = require("../models/user");

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

      const new_user = await User.create({
        username: req.body.username,
        password: req.body.password,
      });

      return res.json({ message: "SignUp Success", new_user });
    });
  },
];
