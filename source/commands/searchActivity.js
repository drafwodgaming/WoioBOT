const { SlashCommandBuilder } = require('discord.js');
const {
	createNewActivityModal,
} = require('@functions/modals/setUpNewActivity');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const {
	formatActivityLink,
} = require('@source/functions/formatter/formatActivityLink');
const { getLocalizedText } = require('@functions/locale/getLocale');
const { getColor } = require('@functions/utils/getColor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.activity.name)
		.setDescription(en.commands.activity.description)
		.setDescriptionLocalizations({
			ru: ru.commands.activity.description,
			uk: uk.commands.activity.description,
		})
		.setDMPermission(false)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.newActivity)
				.setDescription(en.commands.activity.newActivity.description)
				.setDescriptionLocalizations({
					ru: ru.commands.activity.newActivity.description,
					uk: uk.commands.activity.newActivity.description,
				})
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.searchActivity)
				.setDescription(en.commands.activity.searchActivity.description)
				.setDescriptionLocalizations({
					ru: ru.commands.activity.searchActivity.description,
					uk: uk.commands.activity.searchActivity.description,
				})
		),

	async execute(interaction) {
		const { options } = interaction;
		const localizedText = await getLocalizedText(interaction);
		const linksColor = getColor('linksBlue');
		const subCommand = options.getSubcommand();
		switch (subCommand) {
			case en.commands.subcommands.newActivity:
				const modal = await createNewActivityModal(interaction);
				await interaction.showModal(modal);
				break;
			case en.commands.subcommands.searchActivity:
				const activitySchema = interaction.client.models.get('activity');
				const activities = await activitySchema.find({
					guildId: interaction.guildId,
				});

				const activityLinks = activities.map((activity, index) =>
					formatActivityLink(interaction, activity, index, localizedText)
				);

				const embed = {
					title:
						localizedText.commands.activity.searchActivity.activityLinksTitle,
					description: activityLinks.join('\n'),
					color: linksColor,
				};

				await interaction.reply({ embeds: [embed] });
				break;
		}
	},
};
