const { Schema, model } = require('mongoose');

const activitySchema = new Schema({
	ownerId: String,
	name: String,
	description: String,
	maxPlayersCount: Number,
	messageId: String,
	acceptedPlayers: Array,
});

module.exports = model('activity', activitySchema);
