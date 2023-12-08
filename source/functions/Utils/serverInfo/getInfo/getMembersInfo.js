async function getMembersInfo(membersCache) {
	const guildMembersCount = membersCache.filter(
		member => !member.user.bot
	).size;
	const botMembersCount = membersCache.size - guildMembersCount;
	const totalMembersCount = membersCache.size;

	return { guildMembersCount, botMembersCount, totalMembersCount };
}

module.exports = { getMembersInfo };
