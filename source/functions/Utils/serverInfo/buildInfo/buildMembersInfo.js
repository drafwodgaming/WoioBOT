// buildMembersInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getMembersInfo,
} = require('@functions/utils/serverInfo/getInfo/getMembersInfo');

async function buildMembersInfo(membersCache) {
	const { guildMembersCount, botMembersCount, totalMembersCount } =
		await getMembersInfo(membersCache);

	return [
		{
			name: i18n.__('commands.serverInfo.totalMembersCount', {
				totalMembersCount,
			}),
			value: [
				i18n.__('commands.serverInfo.guildMembersCount', { guildMembersCount }),
				i18n.__('commands.serverInfo.guildBotsCount', { botMembersCount }),
			].join('\n'),
		},
	];
}

module.exports = { buildMembersInfo };
