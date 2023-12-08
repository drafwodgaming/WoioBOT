// functions/utils/userInfo/buildRolesInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getRolesInfo,
} = require('@functions/utils/userInfo/getInfo/getRolesInfo');

async function buildRolesInfo(targetUser) {
	const { userRoles, userRolesCount } = await getRolesInfo(targetUser);

	return [
		{
			name: i18n.__('commands.userInfo.memberRoles'),
			value:
				userRolesCount > 0
					? userRoles
					: i18n.__('commands.userInfo.emptyRolesList'),
		},
	];
}

module.exports = { buildRolesInfo };
