const { Schema, model } = require('mongoose');

const welcomeChannelSchema = new Schema({
	channelId: String,
	guildId: String,
});

module.exports = model('welcomechannels', welcomeChannelSchema);
