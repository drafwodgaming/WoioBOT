const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const emojis = require('@config/emojis.json');
const { menus } = require('@config/componentsId.json');
const { createOption } = require('@functions/utils/createSelectMenuOption');
const { getLocalizedText } = require('@functions/locale/getLocale');

async function settingsTempChannel(interaction) {
	const selectorId = menus.settingTempChannel;
	const localizedText = await getLocalizedText(interaction);

	const menuOptions = [
		{
			label: localizedText.components.menus.tempChannel.name.label,
			description: localizedText.components.menus.tempChannel.name.description,
			value: menus.values.tempChannelName,
			emoji: emojis.nameTag,
		},
		{
			label: localizedText.components.menus.tempChannel.limit.label,
			description: localizedText.components.menus.tempChannel.limit.description,
			value: menus.values.tempChannelLimit,
			emoji: emojis.limitPeople,
		},
		{
			label: localizedText.components.menus.tempChannel.lockChannel.label,
			description:
				localizedText.components.menus.tempChannel.lockChannel.description,
			value: menus.values.tempChannelLock,
			emoji: emojis.lockChannel,
		},
		{
			label: localizedText.components.menus.tempChannel.unlockChannel.label,
			description:
				localizedText.components.menus.tempChannel.unlockChannel.description,
			value: menus.values.tempChannelUnlock,
			emoji: emojis.unlockChannel,
		},
	];

	const nameMenu = new StringSelectMenuBuilder()
		.setCustomId(selectorId)
		.setPlaceholder(localizedText.components.menus.tempChannel.changeSettings)
		.addOptions(
			menuOptions.map(option =>
				createOption(
					option.label,
					option.description,
					option.value,
					option.emoji
				)
			)
		);
	const components = [nameMenu];

	return new ActionRowBuilder().addComponents(components);
}

module.exports = { settingsTempChannel };
