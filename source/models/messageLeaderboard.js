const { Schema, model } = require('mongoose');

let messageLeaderboardSchema = new Schema({
	guildId: String,
	userId: String,
	messageCount: Number,
});

module.exports = model('messageLeaderboard', messageLeaderboardSchema);
