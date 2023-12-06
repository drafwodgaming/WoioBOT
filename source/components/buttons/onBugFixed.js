const { buttons } = require('@config/componentsId.json');
const reportBug = require('@source/models/reportBug');
const { bugReportButtons } = require('@functions/buttons/setUpBugReport');
const { i18n } = require('@config/i18nConfig');

module.exports = {
	data: {
		name: buttons.fixedButton,
	},
	async execute(interaction, client) {
		const { id: messageId } = interaction.message;
		// console.log('Searching for report with messageId:', messageId);

		const devBugReports = await reportBug.findOneAndDelete({
			$or: [{ messageToDevId: messageId }, { messageToUserId: messageId }],
		});

		// console.log('Found devBugReport:', devBugReports);

		const { userId } = devBugReports;
		const user = await client.users.fetch(userId);
		await user.send({
			content: i18n.__('components.buttons.bugReport.fixedBug.succesFix'),
		});

		setTimeout(() => console.log('Function completed'), 1000);
		await interaction.deferUpdate();
		await interaction.editReply({
			components: [bugReportButtons(true)],
		});
	},
};
