function getLanguageName(code) {
	const languageNames = {
		en: 'English',
		ru: 'Русский',
		uk: 'Українська',
	};

	return languageNames[code] || code;
}

module.exports = { getLanguageName };
