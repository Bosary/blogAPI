const { Router } = require("express");
const express = require("express");

// MongoDB
require("./config/database");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log("server listening");
});
