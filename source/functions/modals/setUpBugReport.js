const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createBugReportModal() {
	const componentsData = [
		{
			id: modals.reportTitle,
			label: 'components.modals.bugReport.reportTitleInput.label',
			style: TextInputStyle.Short,
			placeholder: 'components.modals.bugReport.reportTitleInput.placeholder',
		},
		{
			id: modals.reportDescription,
			label: 'components.modals.bugReport.reportDescriptionInput.label',
			style: TextInputStyle.Paragraph,
			placeholder:
				'components.modals.bugReport.reportDescriptionInput.placeholder',
		},
	];

	const bugReportModal = new ModalBuilder()
		.setCustomId(modals.bugReport)
		.setTitle(i18n.__('components.modals.bugReport.title'));

	componentsData.forEach(({ id, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(id)
			.setLabel(i18n.__(label))
			.setStyle(style)
			.setPlaceholder(i18n.__(placeholder));

		const row = new ActionRowBuilder().addComponents(inputField);

		bugReportModal.addComponents(row);
	});

	return bugReportModal;
}

module.exports = { createBugReportModal };
