const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');

module.exports = {
	data: {
		name: modals.tempChannelLimit,
	},
	async execute(interaction) {
		await interaction.deferUpdate();
		const newUserLimit = parseInt(
			interaction.fields.getTextInputValue(modals.tempChannelLimitInput)
		);
		const temporaryChannelsSchema =
			interaction.client.models.get('temporaryChannels');

		const localizedText = await getLocalizedText(interaction);

		if (isNaN(newUserLimit) || newUserLimit < 0 || newUserLimit > 99) {
			return await interaction.followUp({
				content: localizedText.components.modals.setLimitTempChannel.errorLimit,
				ephemeral: true,
			});
		}
		const guildId = interaction.guild.id;
		const memberId = interaction.user.id;

		const updatedChannel = await updateRecordField(
			temporaryChannelsSchema,
			{ guildId, creatorId: memberId },
			{ userLimit: newUserLimit }
		);

		if (updatedChannel) {
			const voiceChannel = interaction.guild.channels.cache.get(
				updatedChannel.channelId
			);
			if (voiceChannel) await voiceChannel.setUserLimit(newUserLimit);
		}

		await interaction.followUp({
			content: localizedText.components.modals.setLimitTempChannel.succesLimit,
			ephemeral: true,
		});
	},
};
