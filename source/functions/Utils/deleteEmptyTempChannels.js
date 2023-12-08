const temporaryChannelsSchema = require('@source/models/temporaryChannels');

async function deleteEmptyTempChannels(guild, tempChannels) {
	for (const tempChannel of tempChannels) {
		const { channelId, creatorId } = tempChannel;
		const channel = guild.channels.cache.get(channelId);

		if (channel && channel.members.size === 0) {
			await channel.delete();
			await temporaryChannelsSchema.deleteMany({
				guildId: guild.id,
				creatorId: creatorId,
			});
		}
	}
}

module.exports = { deleteEmptyTempChannels };
