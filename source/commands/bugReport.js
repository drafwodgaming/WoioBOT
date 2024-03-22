const { SlashCommandBuilder } = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const { reportButtons } = require('@functions/buttons/setUpReport');
const mustache = require('mustache');
const emojis = require('@config/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.report.name)
		.setDescription(en.commands.report.description)
		.setDescriptionLocalizations({
			ru: ru.commands.report.description,
			uk: uk.commands.report.description,
		})
		.addStringOption(option =>
			option
				.setName(en.commands.options.typeReportOption)
				.setDescription(en.commands.report.typeDescription)
				.setDescriptionLocalizations({
					ru: ru.commands.report.typeDescription,
					uk: uk.commands.report.typeDescription,
				})
				.setRequired(true)
				.addChoices(
					{ name: 'Bug', value: 'bug' },
					{ name: 'Suggestions', value: 'suggestion' },
					{ name: 'Other', value: 'other' }
				)
		)
		.addStringOption(option =>
			option
				.setName(en.commands.options.reportDescriptionOption)
				.setDescription(en.commands.report.reportDescription)
				.setDescriptionLocalizations({
					ru: ru.commands.report.reportDescription,
					uk: uk.commands.report.reportDescription,
				})
				.setRequired(true)
		)
		.setDMPermission(false),
	async execute(interaction) {
		const { options } = interaction;
		const selectedReport = options.getString(
			en.commands.options.typeReportOption
		);
		const descriptionReport = options.getString(
			en.commands.options.reportDescriptionOption
		);

		const localizedText = await getLocalizedText(interaction);

		let embed = {
			description: mustache.render(localizedText.commands.report.reportBy, {
				user: interaction.user.username,
				guild: interaction.guild.name,
			}),
			fields: [],
		};

		switch (selectedReport) {
			case 'bug':
				const bug = emojis.bug;
				const bugColor = getColor('reports.bug');

				embed.color = bugColor;
				embed.title = mustache.render(localizedText.commands.report.bugTitle, {
					bug,
				});
				embed.fields.push({
					name: localizedText.commands.report.fields.description,
					value: `\`\`\`${descriptionReport}\`\`\``,
					inline: true,
				});
				break;
			case 'suggestion':
				const suggestion = emojis.suggestion;
				const suggestionColor = getColor('reports.suggestion');
				embed.color = suggestionColor;
				embed.title = mustache.render(
					localizedText.commands.report.suggestionTitle,
					{ suggestion }
				);
				embed.fields.push({
					name: localizedText.commands.report.fields.description,
					value: `\`\`\`${descriptionReport}\`\`\``,
					inline: true,
				});
				break;
			case 'other':
				const other = emojis.other;
				const otherColor = getColor('reports.other');
				embed.color = otherColor;
				embed.title = mustache.render(
					localizedText.commands.report.otherTitle,
					{ other }
				);
				embed.fields.push({
					name: localizedText.commands.report.fields.description,
					value: `\`\`\`${descriptionReport}\`\`\``,
					inline: true,
				});
				break;
		}

		await interaction.reply({
			content: localizedText.commands.report.preview,
			embeds: [embed],
			components: [await reportButtons(localizedText)],
			fetcReply: true,
			ephemeral: true,
		});
	},
};
