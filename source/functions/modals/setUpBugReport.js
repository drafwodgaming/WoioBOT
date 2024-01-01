const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function createBugReportModal(interaction) {
	const localizedText = await getLocalizedText(interaction);

	const componentsData = [
		{
			id: modals.reportTitle,
			label: localizedText.components.modals.bugReport.reportTitleInput.label,
			style: TextInputStyle.Short,
			placeholder:
				localizedText.components.modals.bugReport.reportTitleInput.placeholder,
		},
		{
			id: modals.reportDescription,
			label:
				localizedText.components.modals.bugReport.reportDescriptionInput.label,
			style: TextInputStyle.Paragraph,
			placeholder:
				localizedText.components.modals.bugReport.reportDescriptionInput
					.placeholder,
		},
	];

	const bugReportModal = new ModalBuilder()
		.setCustomId(modals.bugReport)
		.setTitle(localizedText.components.modals.bugReport.title);

	componentsData.forEach(({ id, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(id)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		const row = new ActionRowBuilder().addComponents(inputField);

		bugReportModal.addComponents(row);
	});

	return bugReportModal;
}

module.exports = { createBugReportModal };
