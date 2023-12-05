const { Schema, model } = require('mongoose');

const temporaryChannels = new Schema({
	guildId: String,
	channelId: String,
	creatorId: String,
	channelName: String,
	userLimit: Number,
	createdAt: { type: Date, default: Date.now },
});

module.exports = model('temporarychannels', temporaryChannels);
