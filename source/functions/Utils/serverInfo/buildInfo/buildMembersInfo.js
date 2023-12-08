// buildMembersInfo.js
const { i18n } = require('@config/i18nConfig');

async function buildMembersInfo(membersCache) {
	const guildMembersCount = membersCache.filter(
		member => !member.user.bot
	).size;
	const botMembersCount = membersCache.size - guildMembersCount;

	return [
		{
			name: i18n.__('commands.serverInfo.totalMembersCount', {
				memberCount: membersCache.size,
			}),
			value: [
				i18n.__('commands.serverInfo.guildMembersCount', { guildMembersCount }),
				i18n.__('commands.serverInfo.guildBotsCount', { botMembersCount }),
			].join('\n'),
		},
	];
}

module.exports = { buildMembersInfo };
