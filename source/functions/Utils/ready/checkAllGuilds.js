const {
	checkGuildForEmptyChannels,
} = require('@functions/utils/ready/checkGuildForEmptyChannels');

async function checkAllGuilds(client) {
	const guilds = client.guilds.cache;

	for (const guild of guilds.values()) {
		await checkGuildForEmptyChannels(guild);
	}
}

module.exports = { checkAllGuilds };
