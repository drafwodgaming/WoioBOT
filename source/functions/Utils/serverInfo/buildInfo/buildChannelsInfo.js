// buildChannelsInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getChannelsInfo,
} = require('@functions/utils/serverInfo/getInfo/getChannelsInfo');

async function buildChannelsInfo(channels) {
	const { guildChannels, textChannels, voiceChannels, guildCategories } =
		await getChannelsInfo(channels);

	return [
		{
			name: i18n.__('commands.serverInfo.totalChannelsCount', {
				guildChannels,
			}),
			value: [
				i18n.__('commands.serverInfo.textChannelsCount', { textChannels }),
				i18n.__('commands.serverInfo.voiceChannelsCount', { voiceChannels }),
				i18n.__('commands.serverInfo.categoriesCount', { guildCategories }),
			].join('\n'),
		},
	];
}

module.exports = { buildChannelsInfo };
