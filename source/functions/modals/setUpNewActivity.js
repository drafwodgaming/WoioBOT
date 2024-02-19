const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function createNewActivityModal(interaction) {
	const localizedText = await getLocalizedText(interaction);

	const componentsData = [
		{
			id: modals.activityTitle,
			label:
				localizedText.components.modals.newActivity.activityTitleInput.label,
			style: TextInputStyle.Short,
			placeholder:
				localizedText.components.modals.newActivity.activityTitleInput
					.placeholder,
		},
		{
			id: modals.activityDescription,
			label:
				localizedText.components.modals.newActivity.activityDescription.label,
			style: TextInputStyle.Paragraph,
			placeholder:
				localizedText.components.modals.newActivity.activityDescription
					.placeholder,
		},
		{
			id: modals.activityPlayersCount,
			label:
				localizedText.components.modals.newActivity.activityPlayersCount.label,
			style: TextInputStyle.Short,
			placeholder:
				localizedText.components.modals.newActivity.activityPlayersCount
					.placeholder,
		},
	];

	const newActivityModal = new ModalBuilder()
		.setCustomId(modals.newActivity)
		.setTitle(localizedText.components.modals.newActivity.title);

	componentsData.forEach(({ id, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(id)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		if (id === modals.activityPlayersCount)
			inputField.setMinLength(1).setMaxLength(1);

		const row = new ActionRowBuilder().addComponents(inputField);

		newActivityModal.addComponents(row);
	});

	return newActivityModal;
}

module.exports = { createNewActivityModal };
