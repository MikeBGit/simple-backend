const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
  allProblemIDS: {
=======
  allProblems: {
>>>>>>> 67e5579073337c3566f0b38614ecff9b05e3ac01
    type: Array,
  },
});
// Looks for the plural of user
const User = mongoose.model("User", UserSchema);

module.exports = User;
