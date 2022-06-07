const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const userModel = require("./models");

const app = express();
const port = 3001;

app.use(cors());

mongoose.connect(
  "mongodb+srv://rooter:" +
    process.env.MONGODB_PWD +
    "@cluster0.g9mfruq.mongodb.net/" +
    
    process.env.MONGODB_DB_NAME.firstdb +
    "?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});
app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
