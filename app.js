const express = require("express");
const passport = require("passport");

require("./config/passport");
/**
 *  -------- MongoDB ----------
 */
require("./config/database");

/**
 * -------- Express & Middleware -------
 */
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 *  --------- Routes -------------
 */

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

app.use("/", postsRouter);
app.use("/users", usersRouter);
/**
 *  ------ Server --------
 */
app.listen(port, () => {
  console.log("server listening");
});
