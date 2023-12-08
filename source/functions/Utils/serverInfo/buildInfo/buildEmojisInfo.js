// buildEmojisInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getEmojisInfo,
} = require('@functions/utils/serverInfo/getInfo/getEmojisInfo');

async function buildEmojisInfo(emojisCache) {
	const { totalEmojisCount, animatedEmojisCount, staticEmojisCount } =
		await getEmojisInfo(emojisCache);

	return [
		{
			name: i18n.__('commands.serverInfo.totalEmojisCount', {
				totalEmojisCount,
			}),
			value: [
				i18n.__('commands.serverInfo.animatedEmojisCount', {
					animatedEmojisCount,
				}),
				i18n.__('commands.serverInfo.staticEmojisCount', { staticEmojisCount }),
			].join('\n'),
		},
	];
}

module.exports = { buildEmojisInfo };
