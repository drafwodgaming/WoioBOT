const { i18n } = require('@config/i18nConfig');
const {
	getUserStatus,
} = require('@functions/utils/userInfo/getInfo/getUserStatus');
async function buildStatusLabelInfo(targetUser) {
	return [
		{
			name: i18n.__('commands.userInfo.statusLabel'),
			value: i18n.__('commands.userInfo.userStatus', {
				statusList: getUserStatus(targetUser),
			}),
			inline: true,
		},
	];
}

module.exports = { buildStatusLabelInfo };
