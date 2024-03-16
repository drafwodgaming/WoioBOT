const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');
module.exports = {
	data: {
		name: buttons.leaveFromActivityButton,
	},
	async execute(interaction) {
		const { user, message } = interaction;
		const localeText = await getLocalizedText(interaction);
		const langConfig = localeText.components.buttons.activity.leaveFromActivity;
		const activityModel = interaction.client.models.get('activity');
		const activityRecord = await activityModel.findOne({
			messageId: message.id,
		});

		if (!activityRecord)
			return interaction.reply({
				content: langConfig.deletedActivity,
				ephemeral: true,
			});

		const playerId = user.id;

		const isPlayerInGroup = activityRecord.acceptedPlayers.includes(playerId);
		const isOwner = activityRecord.ownerId === playerId;

		if (!isPlayerInGroup || isOwner) {
			const replyContent = isOwner
				? langConfig.ownerCannotLeave
				: langConfig.noInGroup;
			return interaction.reply({ content: replyContent, ephemeral: true });
		}

		const updatedEvent = await activityModel.findOneAndUpdate(
			{ messageId: message.id },
			{ $pull: { acceptedPlayers: playerId } },
			{ upsert: true, new: true }
		);

		await editActivityMessage(interaction, updatedEvent, localeText, false);

		await interaction.reply({
			content: langConfig.successLeaveFromActivity,
			ephemeral: true,
		});
	},
};
