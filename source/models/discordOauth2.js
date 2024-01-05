const { Schema, model } = require('mongoose');

const discordOauth2Schema = new Schema({
	discordId: String,
	refreshToken: String,
});

module.exports = model('oauth2', discordOauth2Schema);
