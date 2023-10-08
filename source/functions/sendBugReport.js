const { i18n } = require('@config/i18nConfig');
const { reportDelete } = require('@source/functions/buttons/setUpReportDelete');
const { buttons } = require('@config/componentsId.json');
const { colors, onwerId } = require('@config/botConfig.json');

async function sendBugReport(interaction, client, bugCommand, bugDescription) {
	const { user } = interaction;
	const botOwnerId = onwerId;
	const botColor = parseInt(colors.editBlue);
	const reportSentMessage = i18n.__('components.modals.bugReport.reportSent');
	const reportInfoTitle = `Report from ${user.displayName}`;
	const embedFields = [
		{ name: 'Chat Command', value: bugCommand },
		{ name: 'Description', value: bugDescription },
	];
	const botOwner = await client.users.fetch(botOwnerId);
	const deleteReportButtonId = buttons.deleteReport;

	await botOwner.send({
		embeds: [{ color: botColor, title: reportInfoTitle, fields: embedFields }],
		components: [reportDelete(deleteReportButtonId)],
	});

	await interaction.reply({
		embeds: [{ color: botColor, description: reportSentMessage }],
		ephemeral: true,
	});
}
module.exports = { sendBugReport };
