const { i18n } = require('@config/i18nConfig');

function getUserStatus(targetUser) {
	const statusList = {
		online: i18n.__('commands.userInfo.online'),
		idle: i18n.__('commands.userInfo.idle'),
		offline: i18n.__('commands.userInfo.offline'),
		dnd: i18n.__('commands.userInfo.dnd'),
	};

	return statusList[
		targetUser.presence ? targetUser.presence.status : 'offline'
	];
}

module.exports = { getUserStatus };
