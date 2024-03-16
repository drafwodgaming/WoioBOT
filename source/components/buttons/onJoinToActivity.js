const { buttons } = require('@config/componentsId.json');
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
		const localeText = await getLocalizedText(interaction);
		const langConfig = localeText.components.buttons.activity.joinToActivity;
		const activityModel = interaction.client.models.get('activity');
		const activityRecord = await activityModel.findOne({
			messageId: message.id,
		});

		if (!activityRecord) {
			return interaction.reply({
				content: langConfig.deletedActivity,
				ephemeral: true,
			});
		}

		const playerId = user.id;
		const isPlayerInGroup = activityRecord.acceptedPlayers.includes(playerId);
		const isOwner = activityRecord.ownerId === playerId;
		const isGroupFull =
			activityRecord.acceptedPlayers.length === activityRecord.maxPlayersCount;

		if (isPlayerInGroup || isOwner) {
			const replyContent = isOwner
				? langConfig.ownerCannotJoin
				: langConfig.alreadyInGroup;
			return interaction.reply({ content: replyContent, ephemeral: true });
		}

		if (isGroupFull) {
			return interaction.reply({
				content: langConfig.groupFull,
				ephemeral: true,
			});
		}

		const updatedEvent = await activityModel.findOneAndUpdate(
			{ messageId: message.id },
			{ $push: { acceptedPlayers: playerId } },
			{ upsert: true, new: true }
		);

		await editActivityMessage(interaction, updatedEvent, localeText, false);

		await interaction.reply({
			content: langConfig.successJoinToActivity,
			ephemeral: true,
		});
	},
};
