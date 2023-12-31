const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
module.exports = {
	data: {
		name: modals.tempChannelName,
	},
	async execute(interaction) {
		await interaction.deferUpdate();
		const { guild, user } = interaction;
		const { id: guildId } = guild;
		const { id: memberId } = user;

		const newChannelName = interaction.fields.getTextInputValue(
			modals.tempChannelNameInput
		);
		const temporaryChannelsSchema =
			interaction.client.models.get('temporaryChannels');

		const localizedText = await getLocalizedText(interaction);

		const updatedChannel = await updateRecordField(
			temporaryChannelsSchema,
			{ guildId, creatorId: memberId },
			{ channelName: newChannelName }
		);

		if (updatedChannel) {
			const voiceChannel = interaction.guild.channels.cache.get(
				updatedChannel?.channelId
			);
			if (voiceChannel) await voiceChannel.setName(newChannelName);
		}

		await interaction.followUp({
			content:
				localizedText.components.modals.setNameTempChannel.succesUpdateName,
			ephemeral: true,
		});
	},
};
