const reportBug = require('@source/models/reportBug');
const { getColor } = require('@functions/utils/getColor');
const { i18n } = require('@config/i18nConfig');

async function reportToDB(interaction, reportTitle, reportDescription) {
	const botColor = getColor('editBlue');
	const { id: userId } = interaction.user;

	const bugReport = await reportBug.create({
		userId,
		reportTitle,
		reportDescription,
	});
	const reportId = bugReport.reportId;

	const reportSentMessage = i18n.__('components.modals.bugReport.reportSent');
	await interaction.reply({
		embeds: [{ color: botColor, description: reportSentMessage }],
		ephemeral: true,
	});

	return { reportId, bugReport };
}

module.exports = { reportToDB };
