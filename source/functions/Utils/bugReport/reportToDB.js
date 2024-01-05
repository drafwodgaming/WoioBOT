const { getColor } = require('@functions/utils/getColor');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const {
	getFieldFromRecord,
} = require('@functions/utils/database/getFieldFromRecord');

async function reportToDB(interaction, reportTitle, reportDescription) {
	const botColor = getColor('editBlue');
	const { id: userId } = interaction.user;
	const reportBug = interaction.client.models.get('reportBug');

	const localizedText = await getLocalizedText(interaction);
	const fieldsToUpdate = {
		reportTitle: reportTitle,
		reportDescription: reportDescription,
		// Add other fields as needed
	};

	const bugReport = await updateRecordField(
		reportBug,
		{ userId },
		fieldsToUpdate
	);

	const fieldValue = await getFieldFromRecord(
		reportBug,
		{ userId },
		'reportId'
	);

	const reportSentMessage =
		localizedText.components.modals.bugReport.reportSent;
	await interaction.reply({
		embeds: [{ color: botColor, description: reportSentMessage }],
		ephemeral: true,
	});

	return { fieldValue, bugReport };
}

module.exports = { reportToDB };
