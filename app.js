const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

require("./config/passport");
/**
 *  -------- MongoDB ----------
 */
require("./config/database");

/**
 * -------- Express & Middleware -------
 */
const app = express();

app.use(cors());
app.use(helmet());
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
