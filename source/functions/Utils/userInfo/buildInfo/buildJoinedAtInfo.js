const { i18n } = require('@config/i18nConfig');
const { formatDate } = require('@functions/utils/formatter/formatDate');

async function buildJoinedAtInfo(memberJoinedTime) {
	const memberJoinedTimeFormatted = formatDate(memberJoinedTime);

	return [
		{
			name: i18n.__('commands.userInfo.joinedAt'),
			value: i18n.__('commands.userInfo.joinedTime', {
				memberJoinedTime: memberJoinedTimeFormatted,
			}),
			inline: true,
		},
	];
}

module.exports = { buildJoinedAtInfo };
