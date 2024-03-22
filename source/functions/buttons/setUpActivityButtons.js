const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

async function activityButtons(interaction, disableGroupReadyButton) {
	const joinToActivityId = buttons.joinToActivityButton;
	const leaveFromActivityId = buttons.leaveFromActivityButton;
	const groupReadyId = buttons.groupReadyButton;
	const localizedText = await getLocalizedText(interaction);

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(joinToActivityId)
			.setLabel(localizedText.components.buttons.activity.joinToActivity.name)
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId(leaveFromActivityId)
			.setLabel(
				localizedText.components.buttons.activity.leaveFromActivity.name
			)
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId(groupReadyId)
			.setLabel(localizedText.components.buttons.activity.groupReady.name)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disableGroupReadyButton)
	);
}

module.exports = { activityButtons };
