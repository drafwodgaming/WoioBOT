const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function handleLockUnlock(interaction, permission) {
	const { guild, user } = interaction;
	const { id: guildId } = guild;
	const { id: creatorId } = user;

	const temporaryChannelsSchema =
		interaction.client.models.get('temporaryChannels');

	const updatedChannel = await temporaryChannelsSchema.findOne({
		guildId,
		creatorId,
	});

	const localizedText = await getLocalizedText(interaction);

	if (updatedChannel) {
		const voiceChannel = guild.channels.cache.get(updatedChannel.channelId);

		if (voiceChannel) {
			const everyoneRole = guild.roles.everyone;

			await voiceChannel.permissionOverwrites.edit(everyoneRole, {
				Connect: permission,
			});
		}
	}
	await interaction.deferUpdate();

	if (permission) {
		const successUnlockContent =
			localizedText.components.menus.tempChannel.unlockChannel.successUnlock;

		if (successUnlockContent) {
			await interaction.followUp({
				content: successUnlockContent,
				ephemeral: true,
			});
		}
	} else {
		const successLockContent =
			localizedText.components.menus.tempChannel.lockChannel.successLock;

		if (successLockContent) {
			await interaction.followUp({
				content: successLockContent,
				ephemeral: true,
			});
		}
	}
}

module.exports = { handleLockUnlock };
