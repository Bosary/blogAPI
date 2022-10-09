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

const indexRouter = require("./routes/index");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

app.use("/", indexRouter); // Redirect to '/posts', necessary to avoid CastError
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
/**
 *  ------ Server --------
 */
app.listen(port, () => {
  console.log("server listening");
});
