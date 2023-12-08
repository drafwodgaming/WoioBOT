const { SlashCommandBuilder } = require('discord.js');
const { createBugReportModal } = require('@functions/modals/setUpBugReport');
const reportBug = require('@source/models/reportBug');
const { i18n } = require('@config/i18nConfig');
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
		const { user } = interaction;
		const { id: userId } = user;
		const existingReport = await reportBug.findOne({ userId });

		if (existingReport) {
			return await interaction.reply({
				content: i18n.__('commands.bugReport.reportExists'),
				ephemeral: true,
			});
		}

		await interaction.showModal(createBugReportModal());
	},
};
