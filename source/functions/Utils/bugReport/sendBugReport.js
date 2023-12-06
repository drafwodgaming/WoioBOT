const { v4: uuidv4 } = require('uuid');
const reportBug = require('@source/models/reportBug');
const { bugReportButtons } = require('@functions/buttons/setUpBugReport');

const { getColor } = require('@functions/utils/getColor');
const { i18n } = require('@config/i18nConfig');
const { onwerId } = require('@config/botConfig.json');

async function sendBugReport(
	client,
	userId,
	reportId,
	bugCommand,
	bugDescription
) {
	const botOwnerId = onwerId;
	const botOwner = await client.users.fetch(botOwnerId);
	const botColor = getColor('default');

	const bugReport = await reportBug.findOne({ userId, reportId });

	if (!bugReport) {
		return console.error('Bug report not found in the database');
	}

	const reportInfoTitle = `Bug Report from ${userId}`;
	const embedFields = [
		{
			name: i18n.__('components.bugReport.reportSentToUser.userId'),
			value: userId,
		},
		{
			name: i18n.__('components.bugReport.reportSentToUser.reportId'),
			value: reportId,
		},
		{
			name: i18n.__('components.bugReport.reportSentToUser.bugName'),
			value: bugCommand,
		},
		{
			name: i18n.__('components.bugReport.reportSentToUser.bugDescription'),
			value: bugDescription,
		},
	];

	const botOwnerMessage = await botOwner.send({
		embeds: [{ color: botColor, title: reportInfoTitle, fields: embedFields }],
		components: [bugReportButtons(false)],
	});

	const user = await client.users.fetch(userId);
	const userMessage = await user.send({
		embeds: [
			{
				color: botColor,
				title: 'Your Bug Report',
				description:
					'Thank you for submitting a bug report! Here are the details:',
				fields: embedFields,
			},
		],
	});

	await reportBug.updateOne(
		{ userId, reportId },
		{
			$set: {
				messageToUserId: userMessage.id,
				messageToDevId: botOwnerMessage.id,
			},
		}
	);
}

module.exports = { sendBugReport };
