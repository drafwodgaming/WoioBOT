const { SlashCommandBuilder, bold } = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.help.name)
		.setDescription(en.commands.help.description)
		.setDescriptionLocalizations({
			ru: ru.commands.help.description,
			uk: uk.commands.help.description,
		}),
	async execute(interaction) {
		const defaultBotColor = getColor('default');
		const helpTitle = i18n.__('commands.help.title');

		const buildCommandDescription = commandsArray =>
			commandsArray
				.map(({ name, description }) => `/${bold(name)}\n${description}\n`)
				.join('\n');

		const embedDescription = buildCommandDescription(
			interaction.client.commandsArray
		);

		await interaction.reply({
			embeds: [
				{
					color: defaultBotColor,
					title: helpTitle,
					description: embedDescription,
				},
			],
			ephemeral: true,
		});
	},
};
