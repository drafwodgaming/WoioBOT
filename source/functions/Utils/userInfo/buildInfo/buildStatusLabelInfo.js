const { i18n } = require('@config/i18nConfig');
const {
	getUserStatus,
} = require('@functions/utils/userInfo/getInfo/getUserStatus');
async function buildStatusLabelInfo(targetUser) {
	const statusList = getUserStatus(targetUser);
	return [
		{
			name: i18n.__('commands.userInfo.statusLabel'),
			value: i18n.__('commands.userInfo.userStatus', { statusList }),
			inline: true,
		},
	];
}

module.exports = { buildStatusLabelInfo };
