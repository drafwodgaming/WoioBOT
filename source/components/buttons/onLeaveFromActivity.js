const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');
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

		await editActivityMessage(interaction, updatedEvent, localizedText, false);

		await interaction.reply({
			content: languageConfig.successLeaveFromActivity,
			ephemeral: true,
		});
	},
};
