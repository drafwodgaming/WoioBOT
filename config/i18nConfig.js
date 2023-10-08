const i18n = require('i18n');
const path = require('path');
i18n.configure({
	locales: ['en', 'ru', 'uk'], // Добавьте здесь все поддерживаемые языки
	defaultLocale: 'en', // Язык по умолчанию, если не удается определить язык пользователя
	directory: path.join(__dirname, 'languages'),
	objectNotation: true, // Использовать объектную нотацию для доступа к ключам локализации
	register: global,
	fallbacks: { 'en-US': 'en' },
	updateFiles: false,
	mustacheConfig: {
		tags: ['{{', '}}'],
		disable: false,
	},
});

module.exports = { i18n };
