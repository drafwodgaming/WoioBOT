const { i18n } = require('@config/i18nConfig');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');

async function handleLockUnlock(interaction, permission) {
	const guildId = interaction.guild.id;
	const memberId = interaction.user.id;
	const updatedChannel = await temporaryChannelsSchema.findOne({
		guildId,
		creatorId: memberId,
	});

	if (updatedChannel) {
		const voiceChannel = interaction.guild.channels.cache.get(
			updatedChannel.channelId
		);

		if (voiceChannel) {
			const everyoneRole = interaction.guild.roles.everyone;

			await voiceChannel.permissionOverwrites.edit(everyoneRole, {
				Connect: permission,
			});
		}
	}

	const actionType = permission ? 'Unlock' : 'Lock';
	const messageType = permission ? 'unlockChannel' : 'lockChannel';
	const contentKey = `components.menus.tempChannel.${messageType}.success${actionType}`;
	await interaction.deferUpdate();
	await interaction.followUp({
		content: i18n.__(contentKey),
		ephemeral: true,
	});
}

module.exports = { handleLockUnlock };
