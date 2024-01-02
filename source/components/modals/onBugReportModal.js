const { reportToDB } = require('@functions/utils/bugReport/reportToDB');
const { modals } = require('@config/componentsId.json');
const { sendBugReport } = require('@functions/utils/bugReport/sendBugReport');

module.exports = {
	data: {
		name: modals.bugReport,
	},
	async execute(interaction, client) {
		const userId = interaction.user.id;
		const reportTitle = interaction.fields.getTextInputValue(
			modals.reportTitle
		);
		const reportDescription = interaction.fields.getTextInputValue(
			modals.reportDescription
		);

		const { fieldValue } = await reportToDB(
			interaction,
			reportTitle,
			reportDescription
		);

		await sendBugReport(
			client,
			userId,
			fieldValue,
			reportTitle,
			reportDescription,
			interaction
		);
	},
};
