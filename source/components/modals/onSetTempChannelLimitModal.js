const { modals } = require('@config/componentsId.json');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const { i18n } = require('@config/i18nConfig');

module.exports = {
	data: {
		name: modals.tempChannelLimit,
	},
	async execute(interaction) {
		await interaction.deferUpdate();
		const newUserLimit = parseInt(
			interaction.fields.getTextInputValue(modals.tempChannelLimitInput)
		);

		if (isNaN(newUserLimit) || newUserLimit < 0 || newUserLimit > 99) {
			return await interaction.followUp({
				content: i18n.__('components.modals.setLimitTempChannel.errorLimit'),
				ephemeral: true,
			});
		}
		const guildId = interaction.guild.id;
		const memberId = interaction.user.id;

		const updatedChannel = await temporaryChannelsSchema.findOneAndUpdate(
			{ guildId, creatorId: memberId },
			{ $set: { userLimit: newUserLimit } },
			{ new: true }
		);

		if (updatedChannel) {
			const voiceChannel = interaction.guild.channels.cache.get(
				updatedChannel.channelId
			);
			if (voiceChannel) await voiceChannel.setUserLimit(newUserLimit);
		}

		await interaction.followUp({
			content: i18n.__('components.modals.setLimitTempChannel.succesLimit'),
			ephemeral: true,
		});
	},
};
