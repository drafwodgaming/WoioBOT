const { StringSelectMenuOptionBuilder } = require('discord.js');

function createOption(label, description, value, emoji) {
	return new StringSelectMenuOptionBuilder()
		.setLabel(label)
		.setDescription(description)
		.setValue(value)
		.setEmoji(emoji);
}

module.exports = { createOption };
