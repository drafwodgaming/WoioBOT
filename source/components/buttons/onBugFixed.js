const { buttons } = require('@config/componentsId.json');
const reportBug = require('@source/models/reportBug');
const { bugReportButtons } = require('@functions/buttons/setUpBugReport');
const { getColor } = require('@functions/utils/getColor');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

module.exports = {
	data: {
		name: buttons.fixedButton,
	},
	async execute(interaction, client) {
		const { id: messageId } = interaction.message;
		const bugFixed = getColor('successReportFixed');
		const localizedText = await getLocalizedText(interaction);

		// console.log('Searching for report with messageId:', messageId);

		const devBugReports = await reportBug.findOneAndDelete({
			$or: [{ devMessageId: messageId }, { userMessageId: messageId }],
		});

		// console.log('Found devBugReport:', devBugReports);

		const { userId } = devBugReports;
		const user = await client.users.fetch(userId);

		const fixedEmbed = {
			color: bugFixed, // Зеленый цвет
			title: localizedText.components.buttons.bugReport.fixedBug.succesFix,
		};
		await user.send({ embeds: [fixedEmbed] });

		setTimeout(() => console.log('Function completed'), 1000);

		const components = devBugReports
			? [await bugReportButtons(interaction, true)]
			: [await bugReportButtons(interaction, false)];

		await interaction.deferUpdate();
		await interaction.editReply({ components: components });
	},
};
