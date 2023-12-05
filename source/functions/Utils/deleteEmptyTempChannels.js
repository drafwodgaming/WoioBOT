const temporaryChannelsSchema = require('@source/models/temporaryChannels');

async function deleteEmptyTempChannels(guild, tempChannels) {
	for (const tempChannel of tempChannels) {
		const channel = guild.channels.cache.get(tempChannel.channelId);

		if (channel && channel.members.size === 0) {
			await channel.delete();
			await temporaryChannelsSchema.deleteMany({
				guildId: guild.id,
				creatorId: tempChannel.creatorId,
			});
		}
	}
}

module.exports = { deleteEmptyTempChannels };
