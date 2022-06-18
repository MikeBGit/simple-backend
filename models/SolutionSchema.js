<<<<<<< HEAD
const mongoose = require("mongoose");

const SolutionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  authorID: {
    type: String,
    required: true,
  },
  problemID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  solutionText: String,
});
// Looks for the plural of user
const Solution = mongoose.model("Solution", SolutionSchema);

module.exports = Solution;
=======
const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    solutionText: {
        type: String,
        required: true,
    }
});
// Looks for the plural of user
const Solution = mongoose.model("Solution", SolutionSchema)

module.exports = Solution;

>>>>>>> 67e5579073337c3566f0b38614ecff9b05e3ac01
