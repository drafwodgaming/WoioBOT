const { i18n } = require('@config/i18nConfig');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');

async function handleLockUnlock(interaction, permission) {
	const { guild, user } = interaction;
	const { id: guildId } = guild;
	const { id: creatorId } = user;

	const updatedChannel = await temporaryChannelsSchema.findOne({
		guildId,
		creatorId,
	});

	if (updatedChannel) {
		const voiceChannel = guild.channels.cache.get(updatedChannel.channelId);

		if (voiceChannel) {
			const everyoneRole = guild.roles.everyone;

			await voiceChannel.permissionOverwrites.edit(everyoneRole, {
				Connect: permission,
			});
		}
	}

	const actionType = permission ? 'Unlock' : 'Lock';
	const messageType = permission ? 'unlockChannel' : 'lockChannel';
	const contentKey = `components.menus.tempChannel.${messageType}.success${actionType}`;

	await interaction.deferUpdate();
	await interaction.followUp({ content: i18n.__(contentKey), ephemeral: true });
}

module.exports = { handleLockUnlock };
