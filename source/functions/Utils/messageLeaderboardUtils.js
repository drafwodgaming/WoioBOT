const { i18n } = require('@config/i18nConfig');

function formatLeaderboard(top10, { guild }) {
	const guildMembersCache = guild.members.cache;

	return top10.map((entry, index) => {
		const member = guildMembersCache.get(entry.userId);
		return {
			name: i18n.__('commands.messageLeaderboard.fieldName'),
			value: `${index + 1}. ${member.user.username}: ${entry.messageCount}`,
		};
	});
}

module.exports = { formatLeaderboard };
