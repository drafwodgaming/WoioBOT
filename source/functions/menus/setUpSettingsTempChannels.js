const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const { menus } = require('@config/componentsId.json');
const { createOption } = require('@functions/utils/createSelectMenuOption');
function settingsTempChannel() {
	const selectorId = menus.settingTempChannel;

	const menuOptions = [
		{
			label: en.components.menus.tempChannel.name.label,
			description: en.components.menus.tempChannel.name.description,
			value: menus.values.tempChannelName,
			emoji: emojis.nameTag,
		},
		{
			label: en.components.menus.tempChannel.limit.label,
			description: en.components.menus.tempChannel.limit.description,
			value: menus.values.tempChannelLimit,
			emoji: emojis.limitPeople,
		},
		{
			label: en.components.menus.tempChannel.lockChannel.label,
			description: en.components.menus.tempChannel.lockChannel.description,
			value: menus.values.tempChannelLock,
			emoji: emojis.lockChannel,
		},
		{
			label: en.components.menus.tempChannel.unlockChannel.label,
			description: en.components.menus.tempChannel.unlockChannel.description,
			value: menus.values.tempChannelUnlock,
			emoji: emojis.unlockChannel,
		},
	];

	const nameMenu = new StringSelectMenuBuilder()
		.setCustomId(selectorId)
		.setPlaceholder(en.components.menus.tempChannel.changeSettings)
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

	const actionRow = new ActionRowBuilder().addComponents(nameMenu);

	return actionRow;
}

module.exports = { settingsTempChannel };
