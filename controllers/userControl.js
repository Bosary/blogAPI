const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

/**
 * ------- GET Logic ----------
 */

exports.profile_GET = (req, res, next) => {
  return res.json({ message: "Success Profile Page" });
};

exports.user_detail_GET = (req, res, next) => {
  User.findById(req.params.userId, "username")
    .populate("post")
    .populate("comment")
    .exec((err, user) => {
      if (err) return next(err);

      return res.json({ message: "Detail user success", user });
    });
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

    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    User.findOne({ username: req.body.username }, (err, found_user) => {
      if (err) return res.status(500).send({ error: err });

      if (found_user)
        return res
          .status(400)
          .send([{ param: "username", msg: "User already exist" }]);

      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      // Password secured logic in userSchema
      user.save((err) => {
        if (err) return res.status(500).send({ error: err });
      });

      return res.status(200).json({ message: "SignUp Success", user });
    });
  },
];

exports.login_POST = [
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

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    User.findOne({ username: req.body.username }).exec(async (err, user) => {
      if (err) return res.status(500).send({ error: err });

      if (!user)
        return res
          .status(400)
          .send({ param: "username", msg: "User not found" });

      const validPassword = await user.isValidPassword(req.body.password);

      if (!validPassword) {
        return res
          .status(400)
          .send([{ param: "password", msg: "Incorrect password" }]);
      }

      // Success Login
      const token = await user.generateToken();

      return res.json({ message: "login success", user, token });
    });
  },
];

/*

---Need to check how to destroy jwt token on logout---

exports.logout_POST = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.json({ message: "success logout" });
  });
};
*/
