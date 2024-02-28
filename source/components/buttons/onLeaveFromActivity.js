const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const { activityButtons } = require('@functions/buttons/setUpActivityButtons');
const {
	getColorByPercentage,
} = require('@functions/utils/activity/getColorByPercentage');

module.exports = {
	data: {
		name: buttons.leaveFromActivityButton,
	},
	async execute(interaction) {
		const { user, message } = interaction;
		const localizedText = await getLocalizedText(interaction);
		const languageConfig =
			localizedText.components.buttons.activity.leaveFromActivity;

		const activitySchema = interaction.client.models.get('activity');
		const activityRecord = await activitySchema.findOne({
			messageId: message.id,
		});

		if (!activityRecord)
			return interaction.reply({
				content: languageConfig.deletedActivity,
				ephemeral: true,
			});

		const acceptedPlayer = user.id;

		const isUserInGroup =
			activityRecord.acceptedPlayers.includes(acceptedPlayer);
		const isOwner = activityRecord.ownerId === acceptedPlayer;

		if (!isUserInGroup || isOwner)
			return interaction.reply({
				content: isOwner
					? languageConfig.ownerCannotLeave
					: languageConfig.noInGroup,
				ephemeral: true,
			});

		const updatedEvent = await updateRecordField(
			activitySchema,
			{ messageId: interaction.message.id },
			{ $pull: { acceptedPlayers: acceptedPlayer } },
			{ new: true }
		);

		const percentage =
			(updatedEvent.acceptedPlayers.length / updatedEvent.maxPlayersCount) *
			100;

		const colorActivity = getColorByPercentage(percentage);

		const participantsFieldName =
			localizedText.components.modals.newActivity.activityInfo.playersField;
		const creatorIdFieldName =
			localizedText.components.modals.newActivity.activityInfo.creatorField;

		const embed = generateActivityEmbed(
			updatedEvent.name,
			updatedEvent.description,
			participantsFieldName,
			updatedEvent.acceptedPlayers,
			updatedEvent.maxPlayersCount,
			updatedEvent.ownerId,
			creatorIdFieldName,
			colorActivity
		);

		await interaction.message.edit({
			embeds: [embed],
			components: [await activityButtons(interaction, true)],
		});

		await interaction.reply({
			content: languageConfig.successLeaveFromActivity,
			ephemeral: true,
		});
	},
};
