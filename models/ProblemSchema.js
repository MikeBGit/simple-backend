const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
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
    allProblems: {
        type: Array
    },
    allSolutions: {
        type: Array
    }
});
// Looks for the plural of user
const User = mongoose.model("User", UserSchema)

module.exports = User;

