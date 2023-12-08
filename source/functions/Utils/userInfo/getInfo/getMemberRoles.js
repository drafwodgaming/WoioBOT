async function getMemberRoles(targetUser) {
	return targetUser.roles.cache.map(role => role);
}

module.exports = { getMemberRoles };
