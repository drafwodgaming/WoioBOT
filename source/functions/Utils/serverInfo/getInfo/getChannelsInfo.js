const { ChannelType } = require('discord.js');

async function getChannelsInfo(channelsCache) {
	const guildChannels = channelsCache.size;
	const textChannels = channelsCache.filter(
		channel => channel.type === ChannelType.GuildText
	).size;
	const voiceChannels = channelsCache.filter(
		channel => channel.type === ChannelType.GuildVoice
	).size;
	const guildCategories = channelsCache.filter(
		channel => channel.type === ChannelType.GuildCategory
	).size;

	return {
		guildChannels,
		textChannels,
		voiceChannels,
		guildCategories,
	};
}

module.exports = { getChannelsInfo };
