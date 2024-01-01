const reportBug = require('@source/models/reportBug');
const { getColor } = require('@functions/utils/getColor');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

async function reportToDB(interaction, reportTitle, reportDescription) {
	const botColor = getColor('editBlue');
	const { id: userId } = interaction.user;

	const localizedText = await getLocalizedText(interaction);

	const bugReport = await reportBug.create({
		userId,
		reportTitle,
		reportDescription,
	});
	const reportId = bugReport.reportId;

	const reportSentMessage =
		localizedText.components.modals.bugReport.reportSent;
	await interaction.reply({
		embeds: [{ color: botColor, description: reportSentMessage }],
		ephemeral: true,
	});

	return { reportId, bugReport };
}

module.exports = { reportToDB };
