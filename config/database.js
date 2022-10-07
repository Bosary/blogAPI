const mongoose = require("mongoose");

// Setting up connection to mongoDB
const uri =
  "mongodb+srv://admin:Admin123@authcluster.q6eemb8.mongodb.net/Blog?retryWrites=true&w=majority";
const mongoDB = uri;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
