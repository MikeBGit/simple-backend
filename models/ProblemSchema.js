const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  id: {
    type: String,
<<<<<<< HEAD
    unique: true,
  },
  authorID: {
    type: String,
=======
>>>>>>> 67e5579073337c3566f0b38614ecff9b05e3ac01
    required: true,
  },
  title: {
    type: String,
    required: true,
<<<<<<< HEAD
    unique: true,
=======
>>>>>>> 67e5579073337c3566f0b38614ecff9b05e3ac01
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  errorMessages: {
    type: String,
<<<<<<< HEAD
    required: true,
  },
  codeUsed: {
    type: String,
    required: true,
  },
  allSolutionIDS: {
    type: Array,
=======
  },
  codeUsed: {
    type: String,
  },
  allSolutions: {
    type: Array
  },
  upVotes: {
    type: Number,
>>>>>>> 67e5579073337c3566f0b38614ecff9b05e3ac01
  },
});
// Looks for the plural of user
const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;
