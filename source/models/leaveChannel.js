const { Schema, model } = require('mongoose');

const leaveChannelSchema = new Schema({
	channelId: String,
	guildId: String,
});

module.exports = model('leavechannels', leaveChannelSchema);
