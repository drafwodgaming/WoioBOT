const { SlashCommandBuilder } = require('discord.js');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
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

		const joinToCreateSchema = interaction.client.models.get('joinToCreate');
		const leaveChannelSchema = interaction.client.models.get('leaveChannel');
		const welcomeChannelSchema =
			interaction.client.models.get('welcomeChannel');
		const serverLocaleSchema = interaction.client.models.get('serverLocale');

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
			localizedText.commands.settings.languageSetting,
			{ language: languageName }
		);

		const welcomeChannelField = mustache.render(
			localizedText.commands.settings.welcomeChannelSetting,
			{
				channelId: welcomeChannelDoc
					? `<#${welcomeChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannelSet,
			}
		);

		const leaveChannelField = mustache.render(
			localizedText.commands.settings.leaveChannelSetting,
			{
				channelId: leaveChannelDoc
					? `<#${leaveChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannelSet,
			}
		);

		const joinToCreateChannelField = mustache.render(
			localizedText.commands.settings.joinToCreateChannelSetting,
			{
				channelId: joinToCreateChannelDoc
					? `<#${joinToCreateChannelDoc.channelId}>`
					: localizedText.commands.settings.noChannelSet,
			}
		);

		const embed = {
			color: defaultBotColor,
			title: localizedText.commands.settings.serverSettingsTitle,
			fields: [
				{
					name: localizedText.commands.settings.generalSettingsFieldName,
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
