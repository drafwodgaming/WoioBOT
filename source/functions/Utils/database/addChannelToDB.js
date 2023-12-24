async function addChannel(guildId, channelId, channelModel) {
	let channel = await channelModel.findOne({ guildId });

	const isNew = !channel;

	if (isNew) channel = new channelModel({ channelId, guildId });
	else channel.channelId = channelId;

	await channel.save();
	return { channel, isNew };
}

module.exports = { addChannel };
