const { Schema, model } = require('mongoose');

const activitySchema = new Schema({
	ownerId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: String,
	maxPlayersCount: {
		type: Number,
		required: true,
	},
	messageId: {
		type: String,
		required: true,
	},
	acceptedPlayers: {
		type: Array,
		default: [],
	},
	guildId: {
		type: String,
		required: true,
	},
	channelId: {
		type: String,
		required: true,
	},
	roleId: {
		type: String,
		required: true,
	},
});

module.exports = model('Activity', activitySchema);
