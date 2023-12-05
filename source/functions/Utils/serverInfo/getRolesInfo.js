async function getRolesInfo(rolesCache) {
	const guildRoles = rolesCache
		.map(role => role.toString())
		.slice(0, 15)
		.join(' ');
	const guildRolesCount = rolesCache.size;

	return {
		guildRoles,
		guildRolesCount,
	};
}

module.exports = { getRolesInfo };
