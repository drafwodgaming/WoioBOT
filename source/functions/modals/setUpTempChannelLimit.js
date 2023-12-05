const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { modals } = require('@config/componentsId.json');

function createTempChannelLimit() {
	const tempChannelLimit = new ModalBuilder()
		.setCustomId(modals.tempChannelLimit)
		.setTitle(i18n.__('components.modals.setLimitTempChannel.title'));

	const tempChannelLimitInputField = new TextInputBuilder()
		.setCustomId(modals.tempChannelLimitInput)
		.setLabel(i18n.__('components.modals.setLimitTempChannel.label'))
		.setStyle(TextInputStyle.Short)
		.setPlaceholder(
			i18n.__('components.modals.setLimitTempChannel.limitRoomExample')
		);

	const limitRow = new ActionRowBuilder().addComponents(
		tempChannelLimitInputField
	);

	tempChannelLimit.addComponents(limitRow);

	return tempChannelLimit;
}
module.exports = { createTempChannelLimit };
