const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const en = require('@config/languages/en.json');

async function bugReportButtons(interaction, disable) {
	const fixedId = buttons.fixedButton;
	const localizedText = await getLocalizedText(interaction);

	const button = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(fixedId)
			.setLabel(localizedText.components.buttons.bugReport.fixedBug.name)
			.setStyle(ButtonStyle.Success)
			.setDisabled(disable)
	);
	return button;
}

module.exports = { bugReportButtons };
