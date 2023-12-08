const {
	getMemberRoles,
} = require('@functions/utils/userInfo/getInfo/getMemberRoles');

async function getRolesInfo(targetUser) {
	const memberRolesList = await getMemberRoles(targetUser);

	const userRoles = memberRolesList
		.filter(role => role.id !== targetUser.guild.roles.everyone.id)
		.slice(0, 3)
		.join(' ');

	const userRolesCount = targetUser.roles.cache.size;

	return { userRoles, userRolesCount };
}

module.exports = { getRolesInfo };
