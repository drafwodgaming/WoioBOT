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
	reportTitle,
	reportDescription
) {
	const botOwnerId = onwerId;
	const botOwner = await client.users.fetch(botOwnerId);
	const botColor = getColor('default');

	const messages = {
		reportFrom: i18n.__('components.modals.bugReport.userReport.reportFrom', {
			userId,
		}),
		userId: i18n.__('components.modals.bugReport.userReport.userId'),
		reportId: i18n.__('components.modals.bugReport.userReport.reportId'),
		reportTitle: i18n.__('components.modals.bugReport.userReport.reportTitle'),
		reportDescription: i18n.__(
			'components.modals.bugReport.userReport.reportDescription'
		),
		reportDetailsTitle: i18n.__(
			'components.modals.bugReport.userReport.reportDetails.title'
		),
		reportDetailsDescription: i18n.__(
			'components.modals.bugReport.userReport.reportDetails.description'
		),
	};

	const bugReport = await reportBug.findOne({ userId, reportId });

	if (!bugReport) throw new Error('Bug report not found in the database');

	const reportInfoTitle = i18n.__(messages.reportFrom, { userId });
	const embedFields = [
		{ name: i18n.__(messages.userId), value: userId },
		{ name: i18n.__(messages.reportId), value: reportId },
		{ name: i18n.__(messages.reportTitle), value: reportTitle },
		{ name: i18n.__(messages.reportDescription), value: reportDescription },
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
				title: i18n.__(messages.reportDetailsTitle),
				description: i18n.__(messages.reportDetailsDescription),
				fields: embedFields,
			},
		],
	});

	await reportBug.findOneAndUpdate(
		{ userId, reportId },
		{
			$set: {
				userMessageId: userMessage.id,
				devMessageId: botOwnerMessage.id,
			},
		}
	);
}

module.exports = { sendBugReport };
