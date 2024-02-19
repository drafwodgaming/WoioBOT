const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const mustache = require('mustache');

const { getLocalizedText } = require('@source/functions/locale/getLocale');
const { getLanguageName } = require('@functions/utils/getLanguageName');
const { getLanguageFlag } = require('@functions/utils/getLanguageFlag');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.language.name)
		.setDescription(en.commands.language.description)
		.setDescriptionLocalizations({
			ru: ru.commands.language.description,
			uk: uk.commands.language.description,
		})

		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.setLanguage)
				.setDescription(en.commands.language.setLanguage)
				.setDescriptionLocalizations({
					ru: ru.commands.language.setLanguage,
					uk: uk.commands.language.setLanguage,
				})
				.addStringOption(option =>
					option
						.setName(en.commands.options.languageOption)
						.setDescription(en.commands.language.choiceLanguage)
						.setDescriptionLocalizations({
							ru: ru.commands.language.choiceLanguage,
							uk: uk.commands.language.choiceLanguage,
						})
						.setRequired(true)
						.addChoices(
							{ name: 'English', value: 'en' },
							{ name: 'Русский', value: 'ru' },
							{ name: 'Українська', value: 'uk' }
						)
				)
		)
		.setDMPermission(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, options } = interaction;
		const subCommand = options.getSubcommand();
		const interactionLocale = options.getString(
			en.commands.options.languageOption
		);

		const interactionGuildId = guild.id;

		const languageName = getLanguageName(interactionLocale);
		const languageFlag = getLanguageFlag(interactionLocale);

		const serverLocaleSchema = interaction.client.models.get('serverLocale');

		let responseContent;

		switch (subCommand) {
			case en.commands.subcommands.setLanguage:
				await updateRecordField(
					serverLocaleSchema,
					{ guildId: interactionGuildId },
					{ $set: { language: interactionLocale } }
				);

				const localizedText = await getLocalizedText(interaction);
				responseContent = mustache.render(
					localizedText.commands.language.updateLanguage,
					{ flag: languageFlag, language: languageName }
				);
				break;
		}

		await interaction.reply({
			content: responseContent,
			ephemeral: true,
		});
	},
};
