const { SlashCommandBuilder, bold } = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.help.name)
		.setDescription(en.commands.help.description)
		.setDescriptionLocalizations({
			ru: ru.commands.help.description,
			uk: uk.commands.help.description,
		})
		.setDMPermission(false),
	async execute(interaction, client) {
		const localizedText = await getLocalizedText(interaction);

		const defaultBotColor = getColor('default');
		const helpTitle = localizedText.commands.help.title;

		/**
		 * @param {Command[]} commandsArray - The array of commands.
		 * @returns {string}
		 */
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
