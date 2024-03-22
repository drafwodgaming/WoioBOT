const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const mustache = require('mustache');

const { getLocalizedText } = require('@functions/locale/getLocale');
const { getLanguageName } = require('@functions/utils/getLanguageName');
const { getLanguageFlag } = require('@functions/utils/getLanguageFlag');

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
						.setDescription(en.commands.language.chooseLanguage)
						.setDescriptionLocalizations({
							ru: ru.commands.language.chooseLanguage,
							uk: uk.commands.language.chooseLanguage,
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
	 * Sets the language of a guild.
	 * @param {ChatInputCommandInteraction} interaction - The interaction instance.
	 */
	async execute(interaction) {
		const { guild, options } = interaction;
		const subCommand = options.getSubcommand();
		const selectedLocale = options.getString(
			en.commands.options.languageOption
		);
		const guildId = guild.id;

		if (subCommand !== en.commands.subcommands.setLanguage) return;

		const localeSchema = interaction.client.models.get('serverLocale');
		await localeSchema.updateOne(
			{ guildId },
			{ $set: { language: selectedLocale } },
			{ upsert: true }
		);

		const localizedText = await getLocalizedText(interaction);
		const languageName = getLanguageName(selectedLocale);
		const languageFlag = getLanguageFlag(selectedLocale);

		const responseContent = mustache.render(
			localizedText.commands.language.languageUpdated,
			{ flag: languageFlag, language: languageName }
		);

		await interaction.reply({
			content: responseContent,
			ephemeral: true,
		});
	},
};
