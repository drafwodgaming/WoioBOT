async function deleteChannel(guildId, channelModel) {
	const isDeleted = await channelModel.findOneAndDelete({ guildId });
	return isDeleted;
}

module.exports = { deleteChannel };
