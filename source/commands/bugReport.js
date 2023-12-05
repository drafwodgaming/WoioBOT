const { SlashCommandBuilder } = require('discord.js');
const { createBugReportModal } = require('@functions/modals/setUpBugReport');
const en = require('@config//languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.bugReport.name)
		.setDescription(en.commands.bugReport.description)
		.setDescriptionLocalizations({
			ru: ru.commands.bugReport.description,
			uk: uk.commands.bugReport.description,
		}),
	async execute(interaction) {
		await interaction.showModal(createBugReportModal());
	},
};
