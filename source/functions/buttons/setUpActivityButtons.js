const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function activityButtons(interaction) {
	const joinToActivityId = buttons.joinToActivityButton;
	const leaveFromActivityId = buttons.leaveFromActivityButton;

	const localizedText = await getLocalizedText(interaction);

	const button = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(joinToActivityId)
			.setLabel(localizedText.components.buttons.activity.joinToActivity.name)
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder() // Добавлена еще одна кнопка
			.setCustomId(leaveFromActivityId)
			.setLabel(
				localizedText.components.buttons.activity.leaveFromActivity.name
			)
			.setStyle(ButtonStyle.Danger)
	);
	return button;
}

module.exports = { activityButtons };
