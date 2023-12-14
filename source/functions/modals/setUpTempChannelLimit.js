const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createTempChannelLimit() {
	const componentsData = [
		{
			inputId: modals.tempChannelLimitInput,
			label: 'components.modals.setLimitTempChannel.label',
			style: TextInputStyle.Short,
			placeholder: 'components.modals.setLimitTempChannel.limitRoomExample',
		},
	];

	const tempChannelLimit = new ModalBuilder()
		.setCustomId(modals.tempChannelLimit)
		.setTitle(i18n.__('components.modals.setLimitTempChannel.title'));

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(i18n.__(label))
			.setStyle(style)
			.setPlaceholder(i18n.__(placeholder));

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelLimit.addComponents(row);
	});

	return tempChannelLimit;
}
module.exports = { createTempChannelLimit };
