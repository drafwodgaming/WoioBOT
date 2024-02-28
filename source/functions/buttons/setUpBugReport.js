const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function bugReportButtons(interaction, disable) {
	const fixedId = buttons.fixedButton;
	const localizedText = await getLocalizedText(interaction);

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(fixedId)
			.setLabel(localizedText.components.buttons.bugReport.fixedBug.name)
			.setStyle(ButtonStyle.Success)
			.setDisabled(disable)
	);
}

module.exports = { bugReportButtons };
