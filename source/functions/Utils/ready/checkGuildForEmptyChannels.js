const {
	deleteRecordField,
} = require('@functions/utils/database/deleteRecordField');

async function checkGuildForEmptyChannels(guild) {
	const temporaryChannelsSchema = guild.client.models.get('temporaryChannels');
	const tempChannels = await temporaryChannelsSchema.find({
		guildId: guild.id,
	});

	for (const tempChannel of tempChannels) {
		const channel = guild.channels.cache.get(tempChannel.channelId);

		if (!channel || channel.members.size === 0) {
			await deleteRecordField(temporaryChannelsSchema, {
				guildId: guild.id,
				creatorId: tempChannel.creatorId,
			});

			console.log(
				`Empty channel removed in guild ${guild.name} (${guild.id}):`
			);
			console.log(`- Channel ID: ${tempChannel.channelId}`);
		}
	}
}

module.exports = { checkGuildForEmptyChannels };
