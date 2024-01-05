const {
	deleteEmptyTempChannels,
} = require('@functions/utils/deleteEmptyTempChannels');

async function checkGuildForEmptyChannels(guild) {
	const temporaryChannelsSchema = guild.client.models.get('temporaryChannels');
	const tempChannels = await temporaryChannelsSchema.find({
		guildId: guild.id,
	});

	const emptyChannels = tempChannels.filter(tempChannel => {
		const channel = guild.channels.cache.get(tempChannel.channelId);
		return !channel || channel.members.size === 0;
	});

	if (emptyChannels.length > 0) await deleteEmptyTempChannels(guild);
}

module.exports = { checkGuildForEmptyChannels };
