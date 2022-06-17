const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const saltRounds = 10;

const mongoose = require("mongoose");
const userModel = require("./models/UserSchema");
const problemModel = require("./models/ProblemSchema");
const solutionModel = require("./models/SolutionSchema");

const app = express();
const port = process.env.PORT || 3001; // Heroku determines the port dynamically
app.use(cors());

mongoose.connect(
  "mongodb+srv://rooter:" +
    process.env.MONGODB_PWD +
    "@cluster0.g9mfruq.mongodb.net/" +
    process.env.MONGODB_DB_NAME +
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

/* An API post request using body /users */
// app.post("/users", async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const user = {
//     email: email,
//     password: password,
//   };
//   await userModel.create(user);
//   res.send(user);
// });

/* An API get request using query parameters to /users?email=XXX */
app.get("/user", async (req, res) => {
  const email = req.query.email;
  const user = await userModel.findOne({ email: email });
  res.send(user);
});

/* An API get request using URL path parameters to /users/:email */
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const user = await userModel.findOne({ email: email });
  res.send(user);
});

/* An API post request using body to get user /users/get */
app.post("/users/get", async (req, res) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email: email });
  res.send(user);
});

/* An API post request using body /users.  Replaces the entire user. */
app.put("/users", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = {
    email: email,
    password: password,
  };
  const results = await userModel.replaceOne({ email: email }, user);
  console.log("matched: " + results.matchedCount);
  console.log("modified: " + results.modifiedCount);
  res.send(results);
});

/* An API post request using body /users/email that changes a single field */
app.patch("/users/:email/password", async (req, res) => {
  const email = req.params.email;
  const password = req.body.password;

  const results = await userModel.updateOne(
    { email: email },
    { password: password }
  );
  console.log("matched: " + results.matchedCount);
  console.log("modified: " + results.modifiedCount);
  res.send(results);
});

/* An API delete request using URL path parameters to /users/:email */
app.delete("/users/:email", async (req, res) => {
  const email = req.params.email;
  const results = await userModel.deleteOne({ email: email });
  res.send(results);
});

app.post("/users/register", async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;

  try {
    if (email && password && validator.isStrongPassword(password)) {
      // Check to see if the user already exists. If not, then create it.
      const user = await userModel.findOne({ email: email });
      if (user) {
        console.log(
          "Invalid registration - email " + email + " already exists."
        );
        response.send({ success: false });
        return;
      } else {
        hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Registering email " + email);
        const userToSave = {
          id: uuid(),
          email: email,
          password: hashedPassword,

          firstName: firstName,
          lastName: lastName,
        };
        await userModel.create(userToSave);
        response.send({ success: true });
        return;
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  response.send({ success: false });
});

app.post("/users/login", async (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  try {
    if (email && password) {
      // Check to see if the user already exists. If not, then create it.
      const user = await userModel.findOne({ email: email });
      if (!user) {
        const msg = "Invalid login - email " + email + " doesn't exist.";
        console.log(msg);
        response.send({ success: false, msg: msg });
        return;
      } else {
        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
          console.log("Successful login");
          response.send({ success: true });
          return;
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  response.send({ success: false });
});

// =======================================================================================================

//  Add Problem To Users
app.post("/problem", async (request, response) => {
  const authorEmail = request.body.authorEmail;
  const problem = {
    id: uuid(),
    title: request.body.title,
    shortDescription: request.body.shortDescription,
    fullDescription: request.body.fullDescription,
    errorMessages: request.body.errorMessages,
    codeUsed: request.body.codeUsed,
    allSolutions: [],
  };

  try {
    await userModel.updateOne(
      { email: authorEmail },
      { $addToSet: { allProblems: [problem.id] } }
    );
    const result = await problemModel.create(problem);

    response.send(result);
  } catch (err) {
    response.send(err);
  }
});
//  Add Solution To Problem
app.post("/solution", async (request, response) => {
  const problemID = request.body.problemID;
  const solution = {
    id: uuid(),
    title: request.body.title,
    solutionText: request.body.solutionText,
  };

  try {
    await problemModel.updateOne(
      { id: problemID },
      { $addToSet: { allSolutions: [solution.id] } }
    );
    const result = await solutionModel.create(solution);

    response.send(result);
  } catch (err) {
    response.send(err);
  }
});

app.listen(port, "0.0.0.0", () =>
  console.log(`Hello world app listening on port ${port}!`)
);
