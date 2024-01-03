const temporaryChannelsSchema = require('@source/models/temporaryChannels');
const {
	deleteRecordField,
} = require('@functions/utils/database/deleteRecordField');

async function deleteEmptyTempChannels(guild) {
	const tempChannels = await temporaryChannelsSchema.find({
		guildId: guild.id,
	});
	for (const tempChannel of tempChannels) {
		const { channelId, creatorId } = tempChannel;
		const channel = guild.channels.cache.get(channelId);
		const guildId = guild.id;

		if (channel && channel.members.size === 0) {
			await channel.delete();
			await deleteRecordField(temporaryChannelsSchema, { guildId, creatorId });
		}
	}
}

module.exports = { deleteEmptyTempChannels };
