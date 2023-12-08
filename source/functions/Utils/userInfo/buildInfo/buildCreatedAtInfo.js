const { i18n } = require('@config/i18nConfig');
const { formatDate } = require('@functions/utils/formatter/formatDate');

async function buildCreatedAtInfo(userCreatedAt) {
	const userCreatedAtFormatted = formatDate(userCreatedAt);

	return [
		{
			name: i18n.__('commands.userInfo.createdAt'),
			value: i18n.__('commands.userInfo.createdTime', {
				userCreatedAt: userCreatedAtFormatted,
			}),
			inline: false,
		},
	];
}

module.exports = { buildCreatedAtInfo };
