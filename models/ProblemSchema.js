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
  authorName: String,
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
  upVotes: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
});
// Looks for the plural of user
const Problem = mongoose.model("Problem", ProblemSchema);

module.exports = Problem;
