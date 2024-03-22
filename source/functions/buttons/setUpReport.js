const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
async function reportButtons(localizedText) {
	const sendReportId = buttons.sendReport;

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(sendReportId)
			.setLabel(localizedText.components.buttons.report.sendReport.name)
			.setStyle(ButtonStyle.Success)
	);
}

module.exports = { reportButtons };
