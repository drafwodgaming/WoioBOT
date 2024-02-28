const { buttons } = require('@config/componentsId.json');
const {
	deleteRecordField,
} = require('@functions/utils/database/deleteRecordField');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');
const mustache = require('mustache');
const {
	getColorByPercentage,
} = require('@functions/utils/activity/getColorByPercentage');

module.exports = {
	data: {
		name: buttons.groupReadyButton,
	},
	async execute(interaction) {
		const { user, message } = interaction;
		const localizedText = await getLocalizedText(interaction);
		const languageConfig = localizedText.components.buttons.activity.groupReady;

		const activitySchema = interaction.client.models.get('activity');
		const activityRecord = await activitySchema.findOne({
			messageId: message.id,
		});

		const deletionTimestamp = Date.now() + 10000;
		const deletionTimestampInSeconds = Math.floor(deletionTimestamp / 1000);

		const acceptedPlayer = user.id;

		const isOwner = activityRecord.ownerId === acceptedPlayer;

		if (!isOwner)
			return await interaction.reply({
				content: languageConfig.ownerOnly,
				ephemeral: true,
			});

		const percentage =
			(activityRecord.acceptedPlayers.length / activityRecord.maxPlayersCount) *
			100;

		const colorActivity = getColorByPercentage(percentage);

		const acceptedPlayers = activityRecord.acceptedPlayers
			.map(playerId => `<@${playerId}>`)
			.join(', ');

		const participantsFieldName =
			localizedText.components.modals.newActivity.activityInfo.playersField;
		const creatorIdFieldName =
			localizedText.components.modals.newActivity.activityInfo.creatorField;

		const descriptionWithTimestamp = `${
			activityRecord.description
		} (${mustache.render(languageConfig.deleteAfterTime, {
			deletionTimestampInSeconds,
		})})`;

		const embed = generateActivityEmbed(
			activityRecord.name,
			descriptionWithTimestamp,
			participantsFieldName,
			activityRecord.acceptedPlayers,
			activityRecord.maxPlayersCount,
			activityRecord.ownerId,
			creatorIdFieldName,
			colorActivity
		);

		const embedMessage = await message.edit({
			embeds: [embed],
			components: [],
		});

		setTimeout(async () => {
			await embedMessage.delete();

			await deleteRecordField(activitySchema, { messageId: message.id });
		}, 10000);

		await interaction.reply({
			content: mustache.render(languageConfig.pingPlayers, { acceptedPlayers }),
		});
	},
};
