const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const emojis = require('@config/emojis.json');
const ru = require('@config/languages/ru.json');

function serverRulesButton() {
	const rulesButton = buttons.rulesButton;

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(rulesButton)
			.setLabel(ru.myServer.buttons.serverRules.label)
			.setStyle(ButtonStyle.Secondary)
			.setEmoji(emojis.rules)
	);
}

module.exports = { serverRulesButton };
