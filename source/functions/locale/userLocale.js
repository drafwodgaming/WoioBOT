const i18n = require('i18n');

function getUserLocale(interaction) {
	const userLocale = interaction?.locale || i18n.getLocale();
	i18n.setLocale(userLocale);
	return userLocale;
}

module.exports = { getUserLocale };
