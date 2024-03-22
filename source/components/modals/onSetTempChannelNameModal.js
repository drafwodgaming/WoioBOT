const { modals } = require('@config/componentsId.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

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
		const existingChannel = await temporaryChannelsSchema.findOne({
			guildId,
			creatorId: memberId,
		});

		const durationInMinutes = 5;
		const futureTime = Date.now() + durationInMinutes * 60 * 1000;

		const updatedChannel = await temporaryChannelsSchema.findOneAndUpdate(
			{ guildId, creatorId: memberId },
			{
				$set: {
					channelName: newChannelName,
					renameTime: futureTime,
				},
			},
			{ upsert: true }
		);

		if (existingChannel && existingChannel.renameTime > Date.now()) {
			return await interaction.followUp({
				content:
					localizedText.components.modals.setNameTempChannel
						.renameCooldownMessage,
				ephemeral: true,
			});
		}

		if (updatedChannel) {
			const voiceChannel = interaction.guild.channels.cache.get(
				updatedChannel?.channelId
			);
			if (voiceChannel) await voiceChannel.setName(newChannelName);
		}

		await interaction.followUp({
			content:
				localizedText.components.modals.setNameTempChannel.successMessage,
			ephemeral: true,
		});
	},
};
