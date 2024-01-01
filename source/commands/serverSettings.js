const { SlashCommandBuilder } = require('discord.js');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const joinToCreateSchema = require('@source/models/joinToCreate');
const leaveChannelSchema = require('@source/models/leaveChannel');
const welcomeChannelSchema = require('@source/models/welcomeChannel');
const serverLocaleSchema = require('@source/models/serverLocale');
const { getColor } = require('@functions/utils/getColor');
const { getLanguageName } = require('@functions/utils/getLanguageName');
const mustache = require('mustache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.settings.name)
		.setDescription(en.commands.settings.description)
		.setDescriptionLocalizations({
			ru: ru.commands.settings.description,
			uk: uk.commands.settings.description,
		})
		.setDMPermission(false),

	async execute(interaction) {
		const defaultBotColor = getColor('default');
		const localizedText = await getLocalizedText(interaction);

		const guildLocale = await serverLocaleSchema.findOne({
			guildId: interaction.guild.id,
		});
		const welcomeChannelDoc = await welcomeChannelSchema.findOne({
			guildId: interaction.guild.id,
		});
		const joinToCreateChannelDoc = await joinToCreateSchema.findOne({
			guildId: interaction.guild.id,
		});
		const leaveChannelDoc = await leaveChannelSchema.findOne({
			guildId: interaction.guild.id,
		});

		const languageName = getLanguageName(guildLocale?.language) ?? 'English';

		const languageField = mustache.render(
			localizedText.commands.settings.language,
			{ language: languageName }
		);

		const welcomeChannelField = mustache.render(
			localizedText.commands.settings.welcomeChannel,
			{
				channelId: welcomeChannelDoc
					? `<#${welcomeChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannel,
			}
		);

		const leaveChannelField = mustache.render(
			localizedText.commands.settings.leaveChannel,
			{
				channelId: leaveChannelDoc
					? `<#${leaveChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannel,
			}
		);

		const joinToCreateChannelField = mustache.render(
			localizedText.commands.settings.joinToCreateChannel,
			{
				channelId: joinToCreateChannelDoc
					? `<#${joinToCreateChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannel,
			}
		);

		const embed = {
			color: defaultBotColor,
			title: localizedText.commands.settings.settingServerTitle,
			fields: [
				{
					name: localizedText.commands.settings.serverSettingsFieldName,
					value: [
						languageField,
						welcomeChannelField,
						leaveChannelField,
						joinToCreateChannelField,
					].join('\n\n'),
				},
			],
		};

		await interaction.reply({ embeds: [embed] });
	},
};
