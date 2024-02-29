const { buttons } = require('@config/componentsId.json');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');

module.exports = {
	data: {
		name: buttons.joinToActivityButton,
	},
	async execute(interaction) {
		const { user, message } = interaction;

		const localizedText = await getLocalizedText(interaction);
		const languageConfig =
			localizedText.components.buttons.activity.joinToActivity;

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
		const isGroupFull =
			activityRecord.acceptedPlayers.length === activityRecord.maxPlayersCount;

		if (isUserInGroup || isOwner)
			return interaction.reply({
				content: isOwner
					? languageConfig.ownerCannotJoin
					: languageConfig.alreadyInGroup,
				ephemeral: true,
			});

		if (isGroupFull)
			return interaction.reply({
				content: languageConfig.groupFull,
				ephemeral: true,
			});

		const updatedEvent = await updateRecordField(
			activitySchema,
			{ messageId: message.id },
			{ $push: { acceptedPlayers: acceptedPlayer } },
			{ new: true }
		);

		await editActivityMessage(interaction, updatedEvent, localizedText, false);

		await interaction.reply({
			content: languageConfig.successJoinToActivity,
			ephemeral: true,
		});
	},
};
