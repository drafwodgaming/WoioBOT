// models/joinToCreate.js
const { Schema, model } = require('mongoose');

const temporaryChannels = new Schema({
	guildId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
});

module.exports = model('temporarychannels', temporaryChannels);
