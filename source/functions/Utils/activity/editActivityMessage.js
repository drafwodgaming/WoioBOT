const mustache = require('mustache');
const { activityButtons } = require('@functions/buttons/setUpActivityButtons');
const {
	getColorByPercentage,
} = require('@functions/utils/activity/getColorByPercentage');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');

async function editActivityMessage(
	interaction,
	database,
	localizedText,
	addTimestamp
) {
	const isGroupNowFull =
		database.acceptedPlayers.length === database.maxPlayersCount;
	const components = await activityButtons(interaction, !isGroupNowFull);
	const participantsFieldName =
		localizedText.components.modals.newActivity.activityInfo.playersField;
	const creatorIdFieldName =
		localizedText.components.modals.newActivity.activityInfo.creatorField;

	const percentage =
		(database.acceptedPlayers.length / database.maxPlayersCount) * 100;

	const colorActivity = getColorByPercentage(percentage);

	const creatorUser = await interaction.client.users.fetch(database.ownerId);
	const creatorAvatar = creatorUser.avatarURL();

	let descriptionWithTimestamp = database.description;

	if (addTimestamp) {
		const deletionTimestampInSeconds = Math.floor(Date.now() / 1000) + 10;
		descriptionWithTimestamp += ` (${mustache.render(
			localizedText.components.buttons.activity.groupReady.deleteAfterTime,
			{ deletionTimestampInSeconds }
		)})`;
	}

	const embed = generateActivityEmbed(
		database.name,
		descriptionWithTimestamp,
		participantsFieldName,
		database.acceptedPlayers,
		database.maxPlayersCount,
		database.ownerId,
		creatorIdFieldName,
		colorActivity,
		creatorAvatar
	);

	await interaction.message.edit({
		embeds: [embed],
		components: [components],
	});
}

module.exports = { editActivityMessage };
