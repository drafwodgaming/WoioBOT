const i18n = require('i18n');
const path = require('path');
i18n.configure({
	locales: ['en', 'ru', 'uk'],
	defaultLocale: 'en',
	directory: path.join(__dirname, 'languages'),
	objectNotation: true,
	register: global,
	fallbacks: { 'en-US': 'en' },
	updateFiles: false,
	mustacheConfig: {
		tags: ['{{', '}}'],
		disable: false,
	},
});

module.exports = { i18n };
