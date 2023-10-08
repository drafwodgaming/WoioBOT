const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function reportDelete(reportDeleteId) {
	const button = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(reportDeleteId)
			.setLabel('Delete')
			.setStyle(ButtonStyle.Danger)
	);
	return button;
}

module.exports = { reportDelete };
