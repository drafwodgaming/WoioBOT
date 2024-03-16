const { Schema, model } = require('mongoose');

const temporaryChannels = new Schema({
	guildId: { type: String, required: true },
	channelId: { type: String, required: true },
	creatorId: { type: String, required: true },
	channelName: { type: String, required: true },
	userLimit: { type: Number },
	renameTime: { type: Number, default: 0 },
	isLocked: { type: Boolean, default: false },
});

module.exports = model('temporarychannels', temporaryChannels);
