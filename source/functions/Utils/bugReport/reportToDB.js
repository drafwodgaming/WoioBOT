const { v4: uuidv4 } = require('uuid');
const reportBug = require('@source/models/reportBug');
const { getColor } = require('@functions/utils/getColor');
const { i18n } = require('@config/i18nConfig');

async function reportToDB(interaction, bugCommand, bugDescription) {
	const botColor = getColor('editBlue');
	const userId = interaction.user.id;
	const reportId = uuidv4();

	const bugReport = await reportBug.create({
		userId,
		reportId,
		bugCommand,
		bugDescription,
	});

	await bugReport.save();

	const reportSentMessage = i18n.__('components.modals.bugReport.reportSent');
	await interaction.reply({
		embeds: [{ color: botColor, description: reportSentMessage }],
		ephemeral: true,
	});

	return { reportId, userMessageId: null, developerMessageId: null, bugReport };
}

module.exports = { reportToDB };
