const { i18n } = require('@config/i18nConfig');

function formatLeaderboard(top10, { guild }) {
	const guildMembersCache = guild.members.cache;

	const leaderboardList = top10.map((entry, index) => {
		const member = guildMembersCache.get(entry.userId);
		return `${index + 1}. ${member.user.username}: ${entry.messageCount}`;
	});

	return [
		{
			name: i18n.__('commands.messageLeaderboard.fieldName'),
			value: leaderboardList.join('\n'),
		},
	];
}

module.exports = { formatLeaderboard };
