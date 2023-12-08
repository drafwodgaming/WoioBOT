// functions/utils/userInfo/buildRolesInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getMemberRoles,
} = require('@functions/utils/userInfo/getInfo/getMemberRoles');

async function buildRolesInfo(targetUser) {
	const memberRolesList = await getMemberRoles(targetUser);

	const formattedRoles = memberRolesList
		.filter(role => role.id !== targetUser.guild.roles.everyone.id)
		.slice(0, 3)
		.join(' ');

	return [
		{
			name: i18n.__('commands.userInfo.memberRoles'),
			value:
				formattedRoles.length > 0
					? formattedRoles
					: i18n.__('commands.userInfo.emptyRolesList'),
		},
	];
}

module.exports = { buildRolesInfo };
