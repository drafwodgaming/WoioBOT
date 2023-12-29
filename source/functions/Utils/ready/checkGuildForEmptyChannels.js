const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const {
	deleteEmptyTempChannels,
} = require('@functions/utils/deleteEmptyTempChannels');

async function checkGuildForEmptyChannels(guild) {
	const tempChannels = await temporaryChannelsSchema.find({
		guildId: guild.id,
	});

	const emptyChannels = tempChannels.filter(tempChannel => {
		const channel = guild.channels.cache.get(tempChannel.channelId);
		return !channel || channel.members.size === 0;
	});

	if (emptyChannels.length > 0) {
		await deleteEmptyTempChannels(guild);

		console.log(`${guild}: удалены пустые временные каналы`);
	}
}

module.exports = { checkGuildForEmptyChannels };
