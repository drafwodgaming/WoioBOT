const {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
} = require('discord.js');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const { menus } = require('@config/componentsId.json');

function settingsTempChannel() {
	const nameTag = emojis.nameTag;
	const selectorId = menus.settingTempChannel;
	const nameMenu = new StringSelectMenuBuilder()
		.setCustomId(selectorId)
		.setPlaceholder('Make a selection!')
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel(en.components.menus.tempChannel.name.label)
				.setDescription(en.components.menus.tempChannel.name.description)
				.setValue(menus.values.tempChannelName)
				.setEmoji(nameTag),
			new StringSelectMenuOptionBuilder()
				.setLabel(en.components.menus.tempChannel.limit.label)
				.setDescription(en.components.menus.tempChannel.limit.description)
				.setValue(menus.values.tempChannelLimit)
				.setEmoji(emojis.limitPeople),
			new StringSelectMenuOptionBuilder()
				.setLabel(en.components.menus.tempChannel.lockChannel.label)
				.setDescription(en.components.menus.tempChannel.lockChannel.description)
				.setValue(menus.values.tempChannelLock)
				.setEmoji(emojis.lockChannel),
			new StringSelectMenuOptionBuilder()
				.setLabel(en.components.menus.tempChannel.unlockChannel.label)
				.setDescription(
					en.components.menus.tempChannel.unlockChannel.description
				)
				.setValue(menus.values.tempChannelUnlock)
				.setEmoji(emojis.unlockChannel)
		);

	const actionRow = new ActionRowBuilder().addComponents(nameMenu);

	return actionRow;
}

module.exports = { settingsTempChannel };
