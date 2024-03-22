const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

async function createTempChannelName(interaction) {
	const localizedText = await getLocalizedText(interaction);

	const componentsData = [
		{
			inputId: modals.tempChannelNameInput,
			label: localizedText.components.modals.setNameTempChannel.label,
			style: TextInputStyle.Short,
			placeholder:
				localizedText.components.modals.setNameTempChannel.exampleName,
		},
	];

	const tempChannelName = new ModalBuilder()
		.setCustomId(modals.tempChannelName)
		.setTitle(localizedText.components.modals.setNameTempChannel.title);

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelName.addComponents(row);
	});

	return tempChannelName;
}
module.exports = { createTempChannelName };
