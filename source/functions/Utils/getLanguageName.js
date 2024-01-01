function getLanguageName(code) {
	switch (code) {
		case 'en':
			return 'English';
		case 'ru':
			return 'Русский';
		case 'uk':
			return 'Українська';
		default:
			return code;
	}
}

module.exports = { getLanguageName };
