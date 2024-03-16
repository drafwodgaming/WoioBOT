const { SlashCommandBuilder } = require('discord.js');
const {
	createNewActivityModal,
} = require('@functions/modals/setUpNewActivity');

const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const {
	formatActivityLink,
} = require('@source/functions/formatter/formatActivityLink');
const { getLocalizedText } = require('@functions/locale/getLocale');
const { getColor } = require('@functions/utils/getColor');
const mustache = require('mustache');

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
		const subCommand = interaction.options.getSubcommand();
		const localizedText = await getLocalizedText(interaction);
		const linksColor = getColor('linksBlue');
		const defaultBotColor = getColor('default');
		const warningEmoji = emojis.goldWarning;
		let responseEmbed;

		switch (subCommand) {
			case en.commands.subcommands.newActivity:
				const modal = await createNewActivityModal(interaction);
				return await interaction.showModal(modal);
			case en.commands.subcommands.searchActivity:
				const activitySchema = interaction.client.models.get('activity');
				const activities = await activitySchema.find({
					guildId: interaction.guildId,
				});
				const activityLinks = activities.map((activity, index) =>
					formatActivityLink(interaction, activity, index, localizedText)
				);

				if (activities.length === 0) {
					responseEmbed = {
						description: mustache.render(
							localizedText.commands.activity.searchActivity.noActivities,
							{ warningEmoji }
						),
						color: defaultBotColor,
					};
					return await interaction.reply({
						embeds: [responseEmbed],
						ephemeral: true,
					});
				}
				responseEmbed = {
					title: localizedText.commands.activity.searchActivity.title,
					description: activityLinks.join('\n'),
					color: linksColor,
				};

				return await interaction.reply({
					embeds: [responseEmbed],
					ephemeral: true,
				});
			default:
				return;
		}
	},
};
