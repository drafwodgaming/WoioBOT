const emojis = require('@config/emojis.json');

function getLanguageFlag(languageCode) {
	const languageFlags = {
		en: emojis.englishFlag,
		ru: emojis.russianFlag,
		uk: emojis.ukraineFlag,
	};

	return languageFlags[languageCode] || null;
}

module.exports = { getLanguageFlag };
