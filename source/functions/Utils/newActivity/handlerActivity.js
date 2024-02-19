const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const { getLocalizedText } = require('@functions/locale/getLocale');

async function handlerActivity(interaction, isJoin) {
	const localizedText = await getLocalizedText(interaction);
	const activitySchema = interaction.client.models.get('activity');

	const activityRecord = await activitySchema.findOne({
		messageId: interaction.message.id,
	});

	const acceptedPlayers = interaction.user.id;
	const participantsFieldName =
		localizedText.components.modals.newActivity.activityInfo.playersField;
	const creatorIdFieldName =
		localizedText.components.modals.newActivity.activityInfo.creatorField;

	if (!activityRecord) {
		return interaction.reply({
			content: isJoin
				? localizedText.components.buttons.activity.joinToActivity
						.deletedActivity
				: localizedText.components.buttons.activity.leaveFromActivity
						.deletedActivity,
			ephemeral: true,
		});
	}

	if (activityRecord.ownerId === interaction.user.id) {
		return interaction.reply({
			content: isJoin
				? localizedText.components.buttons.activity.joinToActivity
						.ownerCannotJoin
				: localizedText.components.buttons.activity.leaveFromActivity
						.ownerCannotLeave,
			ephemeral: true,
		});
	}

	const isUserInGroup = activityRecord.acceptedPlayers.includes(
		interaction.user.id
	);

	if ((isJoin && isUserInGroup) || (!isJoin && !isUserInGroup)) {
		return interaction.reply({
			content: isJoin
				? localizedText.components.buttons.activity.joinToActivity
						.alreadyInGroup
				: localizedText.components.buttons.activity.leaveFromActivity.noInGroup,
			ephemeral: true,
		});
	}

	if (
		isJoin &&
		activityRecord.acceptedPlayers.length >= activityRecord.maxPlayersCount
	) {
		return interaction.reply({
			content:
				localizedText.components.buttons.activity.joinToActivity.groupFull,
			ephemeral: true,
		});
	}

	const operation = isJoin ? '$push' : '$pull';

	const updatedEvent = await updateRecordField(
		activitySchema,
		{ messageId: interaction.message.id },
		{ [operation]: { acceptedPlayers: acceptedPlayers } },
		{ new: true }
	);

	const embed = generateActivityEmbed(
		updatedEvent.name,
		updatedEvent.description,
		participantsFieldName,
		updatedEvent.acceptedPlayers,
		updatedEvent.maxPlayersCount,
		updatedEvent.ownerId,
		creatorIdFieldName
	);

	await interaction.message.edit({
		embeds: [embed],
	});

	await interaction.reply({
		content: isJoin
			? localizedText.components.buttons.activity.joinToActivity
					.successJoinToActivity
			: localizedText.components.buttons.activity.leaveFromActivity
					.successLeaveFromActivity,
		ephemeral: true,
	});
}

module.exports = { handlerActivity };
