const { modals } = require('@config/componentsId.json');
const { activityButtons } = require('@functions/buttons/setUpActivityButtons');
const { getLocalizedText } = require('@functions/locale/getLocale');
const {
	generateActivityEmbed,
} = require('@functions/embeds/generateActivityEmbed');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const { getColor } = require('@functions/utils/getColor');

module.exports = {
	data: {
		name: modals.newActivity,
	},
	async execute(interaction) {
		const localizedText = await getLocalizedText(interaction);

		const activityTitle = interaction.fields.getTextInputValue(
			modals.activityTitle
		);
		const activityDescription = interaction.fields.getTextInputValue(
			modals.activityDescription
		);

		const activityPlayersCount = interaction.fields.getTextInputValue(
			modals.activityPlayersCount
		);

		const colorActivity = getColor('activity.redColor');

		if (
			!/^\d+$/.test(activityPlayersCount) ||
			parseInt(activityPlayersCount) <= 0
		)
			return interaction.reply({
				content:
					localizedText.components.modals.newActivity.activityPlayersCount
						.invalidNumberMessage,
				ephemeral: true,
			});

		const participantsFieldName =
			localizedText.components.modals.newActivity.activityInfo.playersField;

		const creatorId = interaction.user.id;
		const creatorIdFieldName =
			localizedText.components.modals.newActivity.activityInfo.creatorField;

		const embed = generateActivityEmbed(
			activityTitle,
			activityDescription,
			participantsFieldName,
			[],
			activityPlayersCount,
			creatorId,
			creatorIdFieldName,
			colorActivity
		);

		await interaction.reply({
			embeds: [embed],
			components: [await activityButtons(interaction, true)],
		});

		await interaction.fetchReply().then(async reply => {
			const activitySchema = interaction.client.models.get('activity');
			await updateRecordField(
				activitySchema,
				{ ownerId: interaction.user.id },
				{
					$set: {
						name: activityTitle,
						description: activityDescription,
						maxPlayersCount: parseInt(activityPlayersCount),
						messageId: reply.id,
						guildId: interaction.guild.id,
						channelId: interaction.channel.id,
					},
				}
			);
		});
	},
};
