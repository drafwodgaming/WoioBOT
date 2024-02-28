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
			await voiceChannel.permissionOverwrites.edit(guild.roles.everyone, {
				Connect: permission,
			});
		}
	}

	await interaction.deferUpdate();

	const successContent = permission
		? localizedText.components.menus.tempChannel.unlockChannel.successUnlock
		: localizedText.components.menus.tempChannel.lockChannel.successLock;

	if (successContent) {
		await interaction.followUp({
			content: successContent,
			ephemeral: true,
		});
	}
}

module.exports = { handleLockUnlock };
