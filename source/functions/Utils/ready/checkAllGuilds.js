const {
	checkGuildForEmptyChannels,
} = require('@functions/utils/ready/checkGuildForEmptyChannels');
const schedule = require('node-schedule');

async function checkAllGuilds(client) {
	schedule.scheduleJob({ dayOfWeek: 0, hour: 18, minute: 0 }, async () => {
		const guilds = await client.guilds.cache;

		for (const guild of guilds.values()) {
			await checkGuildForEmptyChannels(guild);
		}
	});
}

module.exports = { checkAllGuilds };
