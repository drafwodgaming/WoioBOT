const { ChannelType } = require('discord.js');

async function getChannelsInfo(channelsCache) {
	return channelsCache.reduce(
		(counts, channel) => {
			counts.guildChannels++;

			switch (channel.type) {
				case ChannelType.GuildText:
					counts.textChannels++;
					break;
				case ChannelType.GuildVoice:
					counts.voiceChannels++;
					break;
				case ChannelType.GuildCategory:
					counts.guildCategories++;
					break;
			}

			return counts;
		},
		{ guildChannels: 0, textChannels: 0, voiceChannels: 0, guildCategories: 0 }
	);
}

module.exports = { getChannelsInfo };
