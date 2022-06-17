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

