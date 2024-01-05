const { bugReportButtons } = require('@functions/buttons/setUpBugReport');
const { getColor } = require('@functions/utils/getColor');
const { onwerId } = require('@config/botConfig.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const mustache = require('mustache');

async function sendBugReport(
	client,
	userId,
	reportId,
	reportTitle,
	reportDescription,
	interaction
) {
	const botOwnerId = onwerId;
	const botOwner = await client.users.fetch(botOwnerId);
	const botColor = getColor('default');
	const localizedText = await getLocalizedText(interaction);

	const reportBug = interaction.client.models.get('reportBug');

	const messages = {
		reportFrom: mustache.render(
			localizedText.components.modals.bugReport.userReport.reportFrom,
			{ userId }
		),
		userId: localizedText.components.modals.bugReport.userReport.userId,
		reportId: localizedText.components.modals.bugReport.userReport.reportId,
		reportTitle:
			localizedText.components.modals.bugReport.userReport.reportTitle,
		reportDescription:
			localizedText.components.modals.bugReport.userReport.reportDescription,
		reportDetailsTitle:
			localizedText.components.modals.bugReport.userReport.reportDetails.title,
		reportDetailsDescription:
			localizedText.components.modals.bugReport.userReport.reportDetails
				.description,
	};

	// if (!bugReport) throw new Error('Bug report not found in the database');

	const reportInfoTitle = mustache.render(messages.reportFrom, {
		userId,
	});
	const embedFields = [
		{ name: messages.userId, value: userId },
		{ name: messages.reportId, value: reportId },
		{ name: messages.reportTitle, value: reportTitle },
		{
			name: messages.reportDescription,
			value: reportDescription,
		},
	];

	const botOwnerMessage = await botOwner.send({
		embeds: [{ color: botColor, title: reportInfoTitle, fields: embedFields }],
		components: [await bugReportButtons(interaction, false)],
	});

	const user = await client.users.fetch(userId);
	const userMessage = await user.send({
		embeds: [
			{
				color: botColor,
				title: messages.reportDetailsTitle,
				description: messages.reportDetailsDescription,
				fields: embedFields,
			},
		],
	});

	await reportBug.findOneAndUpdate(
		{ userId, reportId },
		{
			$set: { userMessageId: userMessage.id, devMessageId: botOwnerMessage.id },
		}
	);
}

module.exports = { sendBugReport };
