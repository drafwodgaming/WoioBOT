// buildRolesInfo.js
const { i18n } = require('@config/i18nConfig');
const {
	getRolesInfo,
} = require('@functions/utils/serverInfo/getInfo/getRolesInfo');

async function buildRolesInfo(rolesCache) {
	const { guildRoles, guildRolesCount } = await getRolesInfo(rolesCache);
	return [
		{
			name: i18n.__('commands.serverInfo.guildRolesCount', { guildRolesCount }),
			value: guildRoles,
		},
	];
}

module.exports = { buildRolesInfo };
