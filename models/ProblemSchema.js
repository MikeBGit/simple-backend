const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
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
  },
  codeUsed: {
    type: String,
  },
  allSolutions: {
    type: Array
  },
  upVotes: {
    type: Number,
  },
});
// Looks for the plural of user
const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;
