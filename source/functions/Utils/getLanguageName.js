function getLanguageName(langCode) {
	const languageNames = {
		en: 'English',
		ru: 'Русский',
		uk: 'Українська',
	};

	return languageNames[langCode] || langCode;
}

module.exports = { getLanguageName };
