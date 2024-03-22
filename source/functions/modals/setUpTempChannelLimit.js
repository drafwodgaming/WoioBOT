const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

async function createTempChannelLimit(interaction) {
	const localizedText = await getLocalizedText(interaction);

	const componentsData = [
		{
			inputId: modals.tempChannelLimitInput,
			label: localizedText.components.modals.setLimitTempChannel.label,
			style: TextInputStyle.Short,
			placeholder:
				localizedText.components.modals.setLimitTempChannel
					.unlimitedLimitExample,
		},
	];

	const tempChannelLimit = new ModalBuilder()
		.setCustomId(modals.tempChannelLimit)
		.setTitle(localizedText.components.modals.setLimitTempChannel.title);

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(label)
			.setStyle(style)
			.setPlaceholder(placeholder);

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelLimit.addComponents(row);
	});

	return tempChannelLimit;
}
module.exports = { createTempChannelLimit };
