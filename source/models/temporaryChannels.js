const { Schema, model } = require('mongoose');

const temporaryChannels = new Schema({
	guildId: String,
	channelId: String,
	creatorId: String,
	channelName: String,
	userLimit: Number,
});

module.exports = model('temporarychannels', temporaryChannels);
