const { Schema, model } = require("mongoose");

const authUsers = new Schema({
  bungieId: String,
  discordId: String,
});

module.exports = model("authusers", authUsers);
