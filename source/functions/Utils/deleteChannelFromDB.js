async function deleteChannel(guildId, channelModel) {
	return await channelModel.findOneAndDelete({ guildId });
}

module.exports = { deleteChannel };
