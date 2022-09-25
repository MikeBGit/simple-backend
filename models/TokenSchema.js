const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true, unique: true },
  expiresIn: {type: Number},
  refreshToken: {type: String},
  scope: {type: String},
  tokenType: {type: String},
});


const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;