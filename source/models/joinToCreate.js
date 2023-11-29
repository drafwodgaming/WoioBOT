const { Schema, model } = require('mongoose');

const joinToCreateSchema = new Schema({
	channelId: String,
	guildId: String,
});

module.exports = model('jointocreatechannels', joinToCreateSchema);
