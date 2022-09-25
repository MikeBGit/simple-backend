const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const saltRounds = 10;

const mongoose = require("mongoose");
const tokenModel = require("./models/TokenSchema");

const { response } = require("express");
const Token = require("./models/TokenSchema");
// const { findById, findOne } = require("./models/UserSchema");

const app = express();
const port = process.env.PORT || 3001; // Heroku determines the port dynamically
app.use(cors());

mongoose.connect(
  "mongodb+srv://root:normalPassword@music.9ywxovj.mongodb.net/music?retryWrites=true&w=majority",
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
// app.post("/users/register", async (request, response) => {
//   const email = request.body.email;
//   const password = request.body.password;
//   const firstName = request.body.firstName;
//   const lastName = request.body.lastName;
//   try {
//     if (email && password && validator.isStrongPassword(password)) {
//       // Check to see if the user already exists. If not, then create it.
//       const user = await userModel.findOne({ email: email });
//       if (user) {
//         console.log(
//           "Invalid registration - email " + email + " already exists."
//         );
//         response.send({ success: false });
//         return;
//       } else {
//         hashedPassword = await bcrypt.hash(password, saltRounds);
//         console.log("Registering email " + email);
//         console.log("TEST", uuid());
//         const userToSave = {
//           id: uuid(),
//           email: email,
//           password: hashedPassword,

//           firstName: firstName,
//           lastName: lastName,
//         };
//         await userModel.create(userToSave);
//         response.send({ success: true, userID: userToSave.id });
//         return;
//       }
//     }
//   } catch (error) {
//     response.send({ success: false });
//     console.log(error.message);
//   }
// });

// =======================================================================================================
// // Login
// app.post("/users/login", async (request, response) => {
//   const email = request.body.email;
//   const password = request.body.password;
//   try {
//     if (email && password) {
//       // Check to see if the user already exists. If not, then create it.
//       const user = await userModel.findOne({ email: email });
//       if (!user) {
//         const msg = "Invalid login - email " + email + " doesn't exist.";
//         console.log(msg);
//         response.send({ success: false, msg: msg });
//         return;
//       } else {
//         const isSame = await bcrypt.compare(password, user.password);
//         if (isSame) {
//           console.log("Successful login");
//           response.send({
//             success: true,
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//           });
//           return;
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
//   response.send({ success: false });
// });

// =======================================================================================================
// GET ALLS
// =======================================================================================================
app.get("/token", async (req, res) => {
  const tokens = await tokenModel.find();
  res.send(tokens);
});

// =======================================================================================================
// GET ONES
// =======================================================================================================
app.get("/token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await tokenModel.findOne({ id: id });
    res.send(result);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================
// CREATES
// =======================================================================================================

app.post("/token", async (request, response) => {
  const token = {
    accessToken: request.body.accessToken,
    expiresIn: request.body.expiresIn,
    refreshToken: request.body.refreshToken,
    scope: request.body.scope,
    tokenType: request.body.tokenType,
  };

  try {
    const result = await tokenModel.create(token);
    response.send({ result: result, success: true });
  } catch (err) {
    response.send({ message: err.message, success: false });
  }
});

// =======================================================================================================
// UPDATES
// =======================================================================================================
app.patch("/token", async (req, res) => {

  try {
  const results = await tokenModel.updateOne(
    { accessToken: req.body.accessToken },
    {
      expiresIn: req.body.expiresIn,
      refreshToken: req.body.refreshToken,
      scope: req.body.scope,
      tokenType: req.body.tokenType
    }
  );
  res.send({ success: "true" });
  } catch (err) {
    response.send(err.message);
  }
});
// =======================================================================================================
// DELETES
// =======================================================================================================

app.delete("/token", async (req, res) => {
  try {
    const results = await tokenModel.deleteOne({ accessToken: req.body.accessToken });
    res.send(results);
  } catch (err) {
    response.send(err.message);
  }
});

// =======================================================================================================

app.delete("/token/delete/all", async (req, res) => {
  try {
    const tokensDeleted = await tokenModel.deleteMany({});
  
    res.send(tokensDeleted);
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
