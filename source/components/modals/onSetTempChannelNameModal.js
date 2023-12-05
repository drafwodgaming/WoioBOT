const { modals } = require('@config/componentsId.json');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const { i18n } = require('@config/i18nConfig');

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

		const updatedChannel = await temporaryChannelsSchema.findOneAndUpdate(
			{ guildId, creatorId: memberId },
			{ $set: { channelName: newChannelName } },
			{ new: true }
		);

		if (updatedChannel) {
			const voiceChannel = interaction.guild.channels.cache.get(
				updatedChannel?.channelId
			);
			if (voiceChannel) await voiceChannel.setName(newChannelName);
		}
		await interaction.followUp({
			content: i18n.__('components.modals.setNameTempChannel.succesUpdateName'),
			ephemeral: true,
		});
	},
};
