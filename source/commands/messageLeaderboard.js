const { SlashCommandBuilder } = require('discord.js');
const { i18n } = require('../../config/i18nConfig');
const { colors } = require('@config/botConfig.json');
const messageLeaderboardSchema = require('@source/models/messageLeaderboard');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const {
	formatLeaderboard,
} = require('@source/functions/Utils/messageLeaderboardUtils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.messageLeaderboard.name)
		.setDescription(en.commands.messageLeaderboard.description)
		.setDescriptionLocalizations({
			ru: ru.commands.messageLeaderboard.description,
			uk: uk.commands.messageLeaderboard.description,
		})
		.setDMPermission(false),
	async execute(interaction) {
		const { guild } = interaction;
		const guildId = guild.id;

		const top10 = await messageLeaderboardSchema
			.find({ guildId })
			.sort({ messageCount: -1 })
			.limit(10);

		const defaultBotColor = parseInt(colors.default);

		const leaderboardEmbed = {
			color: defaultBotColor,
			title: i18n.__('commands.messageLeaderboard.top10Messages'),
			fields: formatLeaderboard(top10, interaction),
		};

		await interaction.reply({ embeds: [leaderboardEmbed], ephemeral: true });
	},
};
