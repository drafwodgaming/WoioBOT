const { SlashCommandBuilder } = require('discord.js');
const {
	createNewActivityModal,
} = require('@functions/modals/setUpNewActivity');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.searchActivity.name)
		.setDescription('test')
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.newActivity)
				.setDescription('test')
		),

	async execute(interaction) {
		const { options } = interaction;
		const subCommand = options.getSubcommand();
		switch (subCommand) {
			case en.commands.subcommands.newActivity:
				const modal = await createNewActivityModal(interaction);
				await interaction.showModal(modal);
		}
	},
};
