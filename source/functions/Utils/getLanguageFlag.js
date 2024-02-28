const emojis = require('@config/emojis.json');

function getLanguageFlag(code) {
	const flagMap = {
		en: emojis.englishFlag,
		ru: emojis.russianFlag,
		uk: emojis.ukraineFlag,
	};

	return flagMap[code] || null;
}

module.exports = { getLanguageFlag };
