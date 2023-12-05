const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createTempChannelName() {
	const tempChannelName = new ModalBuilder()
		.setCustomId(modals.tempChannelName)
		.setTitle(i18n.__('components.modals.setNameTempChannel.title'));

	const tempChannelNameInputField = new TextInputBuilder()
		.setCustomId(modals.tempChannelNameInput)
		.setLabel(i18n.__('components.modals.setNameTempChannel.label'))
		.setStyle(TextInputStyle.Short);

	const bugCommandRow = new ActionRowBuilder().addComponents(
		tempChannelNameInputField
	);

	tempChannelName.addComponents(bugCommandRow);

	return tempChannelName;
}
module.exports = { createTempChannelName };
