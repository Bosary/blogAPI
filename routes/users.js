const express = require("express");
const { signup_POST } = require("../controllers/userControl");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from user!" });
});

/**
 *  ------- POST --------
 */
router.post("/signup", signup_POST);

module.exports = router;
