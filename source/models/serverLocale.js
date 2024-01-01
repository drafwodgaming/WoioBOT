const { Schema, model } = require('mongoose');

const serverLocale = new Schema({
	guildId: String,
	language: String,
});

module.exports = model('serverlocale', serverLocale);
