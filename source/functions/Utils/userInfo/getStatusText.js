const mustache = require('mustache');
const emojis = require('@config/emojis.json');

function getStatusText(status, localizedText) {
	const onlineEmoji = emojis.online;
	const idleEmoji = emojis.idle;
	const dndEmoji = emojis.dnd;
	const offlineEmoji = emojis.offline;
	const unknownEmoji = emojis.unknown;
	const invisibleEmoji = emojis.invisible;

	switch (status) {
		case 'online':
			return mustache.render(localizedText.commands.userInfo.online, {
				onlineEmoji,
			});
		case 'idle':
			return mustache.render(localizedText.commands.userInfo.idle, {
				idleEmoji,
			});
		case 'dnd':
			return mustache.render(localizedText.commands.userInfo.dnd, {
				dndEmoji,
			});
		case 'invisible':
			return mustache.render(localizedText.commands.userInfo.invisible, {
				invisibleEmoji,
			});
		case 'offline':
			return mustache.render(localizedText.commands.userInfo.offline, {
				offlineEmoji,
			});
		default:
			return mustache.render(localizedText.commands.userInfo.unknown, {
				unknownEmoji,
			});
	}
}

module.exports = { getStatusText };
