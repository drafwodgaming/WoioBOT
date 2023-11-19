const { Events } = require('discord.js');
const messageLeaderboardSchema = require('@source/models/messageLeaderboard');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;

		const { guild, author } = message;
		const filter = { guildId: guild.id, userId: author.id };
		const update = { $inc: { messageCount: 1 } };

		await messageLeaderboardSchema.findOneAndUpdate(filter, update, {
			upsert: true,
		});
	},
};
