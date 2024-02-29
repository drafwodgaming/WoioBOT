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
		const { fields } = interaction;
		const { activityTitle, activityDescription, activityPlayersCount } = modals;

		const localizedText = await getLocalizedText(interaction);

		const activityData = {
			title: fields.getTextInputValue(activityTitle),
			description: fields.getTextInputValue(activityDescription),
			playersCount: parseInt(
				fields.getTextInputValue(activityPlayersCount),
				10
			),
		};

		const colorActivity = getColor('activity.redColor');

		if (isNaN(activityData.playersCount) || activityData.playersCount <= 0)
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

		const creatorUser = await interaction.client.users.fetch(creatorId);
		const creatorAvatar = creatorUser.avatarURL();

		const embed = generateActivityEmbed(
			activityData.title,
			activityData.description,
			participantsFieldName,
			[],
			activityData.playersCount,
			creatorId,
			creatorIdFieldName,
			colorActivity,
			creatorAvatar
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
						name: activityData.title,
						description: activityData.description,
						maxPlayersCount: activityData.playersCount,
						messageId: reply.id,
						guildId: interaction.guild.id,
						channelId: interaction.channel.id,
					},
				}
			);
		});
	},
};
