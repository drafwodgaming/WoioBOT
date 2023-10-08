const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createBugReportModal(bugReportId, bugReportLabel) {
	const bugReportModal = new ModalBuilder()
		.setCustomId(bugReportId)
		.setTitle(bugReportLabel);

	const bugCommandInputField = new TextInputBuilder()
		.setCustomId(modals.bugCommand)
		.setLabel(i18n.__('components.modals.bugReport.bugCommandInput.label'))
		.setStyle(TextInputStyle.Short)
		.setPlaceholder(
			i18n.__('components.modals.bugReport.bugCommandInput.placeholder')
		);

	const bugCommandRow = new ActionRowBuilder().addComponents(
		bugCommandInputField
	);

	const bugDescriptionInputField = new TextInputBuilder()
		.setCustomId(modals.bugDescription)
		.setLabel(i18n.__('components.modals.bugReport.bugDescriptionInput.label'))
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder(
			i18n.__('components.modals.bugReport.bugDescriptionInput.placeholder')
		);

	const bugDescriptionRow = new ActionRowBuilder().addComponents(
		bugDescriptionInputField
	);

	bugReportModal.addComponents(bugCommandRow, bugDescriptionRow);

	return bugReportModal;
}
module.exports = { createBugReportModal };
