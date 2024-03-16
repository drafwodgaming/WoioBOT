async function getGuildLanguage(guildId, localeModel) {
	const defaultLanguage = 'en';

	const localeDoc = await localeModel.findOne({ guildId });

	return localeDoc?.language || defaultLanguage;
}

module.exports = { getGuildLanguage };
