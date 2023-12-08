const moment = require('moment');
const { i18n } = require('@config/i18nConfig');

function formatDate(date) {
	moment.updateLocale(i18n.__('time.moment.momentLocale'), {
		weekdays: i18n.__('time.moment.momentWeekList').split('_'),
	});

	return moment(date).format(i18n.__('time.defaultTimeFormat'));
}

module.exports = { formatDate };
