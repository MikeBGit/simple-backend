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
const { response } = require("express");

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

// =======================================================================================================
// REGISTER & LOGIN

// =======================================================================================================
// Register
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
        console.log("TEST", uuid());
        const userToSave = {
          id: uuid(),
          email: email,
          password: hashedPassword,

          firstName: firstName,
          lastName: lastName,
        };
        await userModel.create(userToSave);
        response.send({ success: true, userID: userToSave.id });
        return;
      }
    }
  } catch (error) {
    response.send({ success: false });
    console.log(error.message);
  }
});

// =======================================================================================================
// Login
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
          response.send({
            success: true,
            id: user.id,
          });
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
// GET ALLS
// =======================================================================================================
app.get("/users", async (req, res) => {
  const user = await userModel.find();
  res.send(user);
});
app.get("/problems", async (req, res) => {
  const problem = await problemModel.find();
  res.send(problem);
});
app.get("/solutions", async (req, res) => {
  const solution = await solutionModel.find();
  res.send(solution);
});
// =======================================================================================================
// GET ONES
// =======================================================================================================
app.get("/problem/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await problemModel.findOne({ id: id });
    res.send(result);
  } catch (err) {
    response.send(err.message);
  }
});
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await userModel.findOne({ id: id });
    res.send(result);
  } catch (err) {
    response.send(err.message);
  }
});

app.get("/solutions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const allSolutions = await solutionModel.find({ problemID: id });
    res.send(allSolutions);
  } catch (err) {
    response.send(err.message);
  }
});
app.get("/solution/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const solution = await solutionModel.findOne({ problemID: id });
    res.send(solution);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// CREATES
// =======================================================================================================
//  User Create Problem
app.post("/problem", async (request, response) => {
  const authorID = request.body.authorID;
  const authorName = request.body.authorName;
  const problem = {
    id: uuid(),
    authorID: authorID,
    title: request.body.title,
    authorName: authorName,
    shortDescription: request.body.shortDescription,
    fullDescription: request.body.fullDescription,
    errorMessages: request.body.errorMessages,
    codeUsed: request.body.codeUsed,
    allSolutions: [],
  };

  try {
    const result = await problemModel.create(problem);
    await userModel.updateOne(
      { id: authorID },
      { $addToSet: { allProblemIDS: problem.id } }
    );
    // const result = await problemModel.create(problem);
    response.send({ result: result, success: true });
  } catch (err) {
    response.send({ message: err.message, success: false });
  }
});

// =======================================================================================================
//  Create Solution to Problem
app.post("/solution", async (request, response) => {
  const problemID = request.body.problemID;
  const authorID = request.body.authorID;
  const solution = {
    id: uuid(),
    problemID: problemID,
    authorID: authorID,
    title: request.body.title,
    solutionText: request.body.solutionText,
  };
  try {
    const result = await solutionModel.create(solution);
    const update = await problemModel.updateOne(
      { id: problemID },
      { $addToSet: { allSolutionIDS: solution.id } }
    );
    response.send({ result: result, success: "true" });
  } catch (err) {
    response.send({ message: err.message, success: "false" });
  }
});

// =======================================================================================================
// UPDATES
// =======================================================================================================
// Update User
app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  try {
    const results = await userModel.updateOne(
      { id: id },
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
      }
    );
    console.log("matched: " + results.matchedCount);
    console.log("modified: " + results.modifiedCount);
    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// Update Problem
app.patch("/problem/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const shortDescription = req.body.shortDescription;
  const fullDescription = req.body.fullDescription;
  const errorMessages = req.body.errorMessages;
  const codeUsed = req.body.codeUsed;

  try {
    const results = await problemModel.updateOne(
      { id: id },
      {
        title: title,
        shortDescription: shortDescription,
        fullDescription: fullDescription,
        errorMessages: errorMessages,
        codeUsed: codeUsed,
      }
    );
    console.log("matched: " + results.matchedCount);
    console.log("modified: " + results.modifiedCount);
    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// Update Solution
app.patch("/solution/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const solutionText = req.body.solutionText;

  try {
    const results = await solutionModel.updateOne(
      { id: id },
      {
        title: title,
        solutionText: solutionText,
      }
    );
    console.log("matched: " + results.matchedCount);
    console.log("modified: " + results.modifiedCount);
    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// DELETES

// =======================================================================================================
// User
app.delete("/user/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const results = await userModel.deleteOne({ email: email });

    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});
// =======================================================================================================
// Problem
app.delete("/problem/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const results = await problemModel.deleteOne({ id: id });

    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// Solution
app.delete("/solution/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const results = await solutionModel.deleteOne({ id: id });

    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
//SEED

app.delete("/delete/all", async (req, res) => {
  try {
    const usersDeleted = await userModel.deleteMany({});
    const problemsDeleted = await problemModel.deleteMany({});
    const solutionsDeleted = await solutionModel.deleteMany({});

    res.send(usersDeleted, problemsDeleted, solutionsDeleted);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================

app.listen(port, "0.0.0.0", () =>
  console.log(`Hello world app listening on port ${port}!`)
);

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
// app.get("/user", async (req, res) => {
//   const email = req.query.email;
//   const user = await userModel.findOne({ email: email });
//   res.send(user);
// });

// /* An API get request using URL path parameters to /users/:email */
// app.get("/users/:email", async (req, res) => {
//   const email = req.params.email;
//   const user = await userModel.findOne({ email: email });
//   res.send(user);
// });

// /* An API post request using body to get user /users/get */
// app.post("/users/get", async (req, res) => {
//   const email = req.body.email;
//   const user = await userModel.findOne({ email: email });
//   res.send(user);
// });

// /* An API post request using body /users.  Replaces the entire user. */
// app.put("/users", async (req, res) => {
//   const password = req.body.password;
//   const email = req.body.email;
//   const user = {
//     email: email,
//     password: password,
//   };
//   const results = await userModel.replaceOne({ email: email }, user);
//   console.log("matched: " + results.matchedCount);
//   console.log("modified: " + results.modifiedCount);
//   res.send(results);
// });

// /* An API post request using body /users/email that changes a single field */
// app.patch("/users/:email/password", async (req, res) => {
//   const email = req.params.email;
//   const password = req.body.password;

//   const results = await userModel.updateOne(
//     { email: email },
//     { password: password }
//   );
//   console.log("matched: " + results.matchedCount);
//   console.log("modified: " + results.modifiedCount);
//   res.send(results);
// });

// /* An API delete request using URL path parameters to /users/:email */
// app.delete("/users/:email", async (req, res) => {
//   const email = req.params.email;
//   const results = await userModel.deleteOne({ email: email });
//   res.send(results);
// });
