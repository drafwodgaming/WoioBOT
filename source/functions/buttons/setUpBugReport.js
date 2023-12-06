const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { i18n } = require('@config/i18nConfig');

function bugReportButtons(disable) {
	const rejectId = buttons.rejectedButton;
	const fixedId = buttons.fixedButton;
	const button = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(fixedId)
			.setLabel(i18n.__('components.buttons.bugReport.fixedBug.name'))
			.setStyle(ButtonStyle.Success)
			.setDisabled(disable)
	);
	return button;
}

module.exports = { bugReportButtons };
