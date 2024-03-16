const { buttons } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');
const {
	editActivityMessage,
} = require('@functions/utils/activity/editActivityMessage');

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

		const acceptedPlayer = user.id;

		const isOwner = activityRecord.ownerId === acceptedPlayer;

		if (!isOwner)
			return await interaction.reply({
				content: languageConfig.ownerOnly,
				ephemeral: true,
			});

		const acceptedPlayers = activityRecord.acceptedPlayers
			.map(playerId => `<@${playerId}>`)
			.join(', ');

		await editActivityMessage(interaction, activityRecord, localizedText, true);

		setTimeout(async () => {
			await message.delete();

			await activitySchema.findOneAndDelete({ messageId: message.id });
		}, 10000);

		await interaction.reply({
			content: mustache.render(languageConfig.pingPlayers, { acceptedPlayers }),
		});
	},
};
