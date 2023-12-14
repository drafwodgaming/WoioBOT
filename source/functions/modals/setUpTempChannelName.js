const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createTempChannelName() {
	const componentsData = [
		{
			inputId: modals.tempChannelNameInput,
			label: 'components.modals.setNameTempChannel.label',
			style: TextInputStyle.Short,
			placeholder: 'components.modals.setNameTempChannel.nameRoomExample',
		},
	];

	const tempChannelName = new ModalBuilder()
		.setCustomId(modals.tempChannelName)
		.setTitle(i18n.__('components.modals.setNameTempChannel.title'));

	componentsData.forEach(({ inputId, label, style, placeholder }) => {
		const inputField = new TextInputBuilder()
			.setCustomId(inputId)
			.setLabel(i18n.__(label))
			.setStyle(style)
			.setPlaceholder(i18n.__(placeholder));

		const row = new ActionRowBuilder().addComponents(inputField);

		tempChannelName.addComponents(row);
	});

	return tempChannelName;
}
module.exports = { createTempChannelName };
