const { Events } = require('discord.js');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');

module.exports = {
	name: Events.ChannelDelete,
	async execute(channel) {
		const isTemporaryChannel = await temporaryChannelsSchema.exists({
			channelId: channel.id,
		});

		if (isTemporaryChannel) {
			await temporaryChannelsSchema.findOneAndDelete({ channelId: channel.id });
		}
	},
};
