const { reportToDB } = require('@functions/utils/bugReport/reportToDB');
const { modals } = require('@config/componentsId.json');
const { sendBugReport } = require('@functions/utils/bugReport/sendBugReport');

module.exports = {
	data: {
		name: modals.bugReport,
	},
	async execute(interaction, client) {
		const userId = interaction.user.id;
		const bugCommand = interaction.fields.getTextInputValue(modals.bugCommand);
		const bugDescription = interaction.fields.getTextInputValue(
			modals.bugDescription
		);

		const { reportId } = await reportToDB(
			interaction,
			bugCommand,
			bugDescription
		);

		await sendBugReport(client, userId, reportId, bugCommand, bugDescription);
	},
};
