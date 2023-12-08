const { i18n } = require('@config/i18nConfig');
const { formatDate } = require('@functions/utils/formatter/formatDate');

async function buildGeneralInfo(guild) {
	const { name, ownerId, createdAt, description } = guild;
	const guildName = name;
	const guildDescription = description;
	const guildCreatedAt = formatDate(createdAt);

	return [
		{
			name: i18n.__('commands.serverInfo.generalLabel'),
			value: [
				i18n.__('commands.serverInfo.guildName', { guildName }),
				i18n.__('commands.serverInfo.guildDescription', { guildDescription }),
				i18n.__('commands.serverInfo.ownerId', { ownerId }),
				i18n.__('commands.serverInfo.createdAt', { guildCreatedAt }),
			].join('\n'),
		},
	];
}

module.exports = { buildGeneralInfo };
