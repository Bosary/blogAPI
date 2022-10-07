const express = require("express");

/**
 *  -------- MongoDB ----------
 */
require("./config/database");

/**
 * -------- Express & Middleware -------
 */
const app = express();
const port = 3000;

/**
 *  --------- Routes -------------
 */
app.get("/", (req, res) => {
  res.send("Hello!");
});

/**
 *  ------ Server --------
 */
app.listen(port, () => {
  console.log("server listening");
});
