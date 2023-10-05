const { Schema, model } = require("mongoose");

const logChannelSchema = new Schema({
  channelId: String,
  guildId: String,
});

module.exports = model("logchannels", logChannelSchema);
