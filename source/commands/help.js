const { SlashCommandBuilder, bold } = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

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
		const localizedHelpText = await getLocalizedText(interaction);
		const defaultColor = getColor('default');

		const embed = {
			color: defaultColor,
			title: localizedHelpText.commands.help.title,
		};

		const descArr = [];
		for (const { name, description } of client.commandsArray) {
			descArr.push(`${bold(name)}\n${description}\n`);
		}
		embed.description = descArr.join('');

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
