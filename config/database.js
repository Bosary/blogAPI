const mongoose = require("mongoose");

// Setting up connection to mongoDB
const mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
