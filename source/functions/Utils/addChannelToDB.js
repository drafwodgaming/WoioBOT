async function addChannel(guildId, channelId, channelModel) {
	let channel = await channelModel.findOne({ guildId });

	if (channel) {
		channel.channelId = channelId;
		await channel.save();
	} else {
		channel = new channelModel({
			channelId,
			guildId,
		});
		await channel.save();
	}

	return channel;
}

module.exports = { addChannel };
