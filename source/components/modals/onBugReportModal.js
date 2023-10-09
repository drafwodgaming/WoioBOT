const { sendBugReport } = require('@source/functions/sendBugReport');
const { modals } = require('@config/componentsId.json');

module.exports = {
	data: {
		name: modals.bugReport,
	},
	async execute(interaction, client) {
		const bugCommand = interaction.fields.getTextInputValue(modals.bugCommand);
		const bugDescription = interaction.fields.getTextInputValue(
			modals.bugDescription
		);

		await sendBugReport(interaction, client, bugCommand, bugDescription);
	},
};
