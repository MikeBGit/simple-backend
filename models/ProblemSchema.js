const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  authorID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
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
    required: true,
  },
  codeUsed: {
    type: String,
    required: true,
  },
  allSolutionIDS: {
    type: Array,
  },
});
// Looks for the plural of user
const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;
