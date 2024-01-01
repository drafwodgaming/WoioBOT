async function getGuildLanguage(guildId, serverLocaleModel) {
	const defaultLanguage = 'en';

	const serverDoc = await serverLocaleModel.findOne({ guildId });

	return serverDoc ? serverDoc.language : defaultLanguage;
}

module.exports = { getGuildLanguage };
