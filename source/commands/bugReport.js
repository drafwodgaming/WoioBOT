const { SlashCommandBuilder } = require('discord.js');
const { createBugReportModal } = require('@functions/modals/setUpBugReport');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.bugReport.name)
		.setDescription(en.commands.bugReport.description)
		.setDescriptionLocalizations({
			ru: ru.commands.bugReport.description,
			uk: uk.commands.bugReport.description,
		})
		.setDMPermission(false),
	async execute(interaction) {
		const { user } = interaction;
		const { id: userId } = user;
		const reportBug = interaction.client.models.get('reportBug');

		const existingReport = await reportBug.findOne({ userId });
		const localizedText = await getLocalizedText(interaction);

		if (existingReport) {
			return await interaction.reply({
				content: localizedText.commands.bugReport.reportExists,
				ephemeral: true,
			});
		}

		const modal = await createBugReportModal(interaction);
		await interaction.showModal(modal);
	},
};
