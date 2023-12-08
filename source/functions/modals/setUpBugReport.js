const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createBugReportModal() {
	const bugReportModal = new ModalBuilder()
		.setCustomId(modals.bugReport)
		.setTitle(i18n.__('components.modals.bugReport.title'));

	const bugCommandInputField = new TextInputBuilder()
		.setCustomId(modals.reportTitle)
		.setLabel(i18n.__('components.modals.bugReport.reportTitleInput.label'))
		.setStyle(TextInputStyle.Short)
		.setPlaceholder(
			i18n.__('components.modals.bugReport.reportTitleInput.placeholder')
		);

	const bugCommandRow = new ActionRowBuilder().addComponents(
		bugCommandInputField
	);

	const bugDescriptionInputField = new TextInputBuilder()
		.setCustomId(modals.reportDescription)
		.setLabel(
			i18n.__('components.modals.bugReport.reportDescriptionInput.label')
		)
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder(
			i18n.__('components.modals.bugReport.reportDescriptionInput.placeholder')
		);

	const bugDescriptionRow = new ActionRowBuilder().addComponents(
		bugDescriptionInputField
	);

	bugReportModal.addComponents(bugCommandRow, bugDescriptionRow);

	return bugReportModal;
}
module.exports = { createBugReportModal };
