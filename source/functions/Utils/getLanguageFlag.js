const emojis = require('@config/emojis.json');
function getLanguageFlag(code) {
	switch (code) {
		case 'en':
			return emojis.englishFlag;
		case 'ru':
			return emojis.russianFlag;
		case 'uk':
			return emojis.ukraineFlag;
	}
}

module.exports = { getLanguageFlag };
