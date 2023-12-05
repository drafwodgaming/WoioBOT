const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createTempChannelLimit() {
	const tempChannelName = new ModalBuilder()
		.setCustomId(modals.tempChannelLimit)
		.setTitle(i18n.__('components.modals.setLimitTempChannel.title'));

	const tempChannelNameInputField = new TextInputBuilder()
		.setCustomId(modals.tempChannelLimitInput)
		.setLabel(i18n.__('components.modals.setLimitTempChannel.label'))
		.setStyle(TextInputStyle.Short);

	const bugCommandRow = new ActionRowBuilder().addComponents(
		tempChannelNameInputField
	);

	tempChannelName.addComponents(bugCommandRow);

	return tempChannelName;
}
module.exports = { createTempChannelLimit };
