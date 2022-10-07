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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 *  --------- Routes -------------
 */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);
/**
 *  ------ Server --------
 */
app.listen(port, () => {
  console.log("server listening");
});
