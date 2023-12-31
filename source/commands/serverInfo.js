const { SlashCommandBuilder, ChannelType, bold } = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { getColor } = require('@source/functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { formatDate } = require('@functions/utils/formatter/formatDate');
const emojis = require('@config/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.serverInfo.name)
		.setDescription(en.commands.serverInfo.description)
		.setDescriptionLocalizations({
			ru: ru.commands.serverInfo.description,
			uk: uk.commands.serverInfo.description,
		})
		.setDMPermission(false),
	async execute(interaction) {
		const { guild } = interaction;
		const { members, roles, channels } = guild;
		const { name, ownerId, createdAt } = guild;

		const guildCreatedAt = formatDate(createdAt);
		const defaultBotColor = getColor('default');

		const guildMembersCount = members.cache.filter(
			member => !member.user.bot
		).size;
		const botMembersCount = members.cache.size - guildMembersCount;
		const totalMembersCount = members.cache.size;

		const guildIcon = guild.iconURL();
		const guildId = guild.id;

		const guildChannels = channels.cache.size;
		const guildCategories = channels.cache.filter(
			c => c.type === ChannelType.GuildCategory
		).size;
		const textChannels = channels.cache.filter(
			c => c.type === ChannelType.GuildText
		).size;

		const textChannelsIco = emojis.textChannel;
		const voiceChannelsIco = emojis.voiceChannel;
		const categoriesIco = emojis.category;
		const annnouncementChannelIco = emojis.announcement;
		const stageChannelIco = emojis.stage;
		const forumIco = emojis.forum;

		const voiceChannels = channels.cache.filter(
			c => c.type === ChannelType.GuildVoice
		).size;
		const annnouncementChannel = guild.channels.cache.filter(
			c => c.type === ChannelType.GuildAnnouncement
		).size;
		const stageChannel = channels.cache.filter(
			c => c.type === ChannelType.GuildStageVoice
		).size;
		const forum = channels.cache.filter(
			c => c.type === ChannelType.GuildForum
		).size;

		const guildEmojis = guild.emojis.cache;
		const totalEmojisCount = guildEmojis.size;
		const animatedEmojisCount = guildEmojis.filter(
			emoji => emoji.animated
		).size;
		const staticEmojisCount = totalEmojisCount - animatedEmojisCount;

		const guildRoles = roles.cache
			.map(role => role)
			.slice(0, 15)
			.join(' ');
		const guildRolesCount = roles.cache.size;

		const description =
			interaction.guild.description ||
			i18n.__('commands.serverInfo.noDescription');

		const serverInfoEmbed = {
			color: defaultBotColor,
			description: bold(description),
			fields: [
				{
					name: i18n.__('commands.serverInfo.generalLabel'),
					value: [
						i18n.__('commands.serverInfo.ownerId', { ownerId }),
						i18n.__('commands.serverInfo.createdAt', { guildCreatedAt }),
					].join('\n'),
				},
				{
					name: i18n.__('commands.serverInfo.totalMembersCount', {
						totalMembersCount,
					}),
					value: [
						i18n.__('commands.serverInfo.guildMembersCount', {
							guildMembersCount,
						}),
						i18n.__('commands.serverInfo.guildBotsCount', { botMembersCount }),
					].join('\n'),
				},
				{
					name: i18n.__('commands.serverInfo.totalChannelsCount', {
						guildChannels,
					}),
					value: [
						i18n.__('commands.serverInfo.textChannelsCount', {
							textChannelsIco,
							textChannels,
						}),
						i18n.__('commands.serverInfo.voiceChannelsCount', {
							voiceChannelsIco,
							voiceChannels,
						}),
						i18n.__('commands.serverInfo.categoriesCount', {
							categoriesIco,
							guildCategories,
						}),
						i18n.__('commands.serverInfo.annnouncementChannelsCount', {
							annnouncementChannelIco,
							annnouncementChannel,
						}),
						i18n.__('commands.serverInfo.stageChannelsCount', {
							stageChannelIco,
							stageChannel,
						}),
						i18n.__('commands.serverInfo.forumCount', { forumIco, forum }),
					].join(' | '),
				},
				{
					name: i18n.__('commands.serverInfo.totalEmojisCount', {
						totalEmojisCount,
					}),
					value: [
						i18n.__('commands.serverInfo.animatedEmojisCount', {
							animatedEmojisCount,
						}),
						i18n.__('commands.serverInfo.staticEmojisCount', {
							staticEmojisCount,
						}),
					].join('\n'),
				},
				{
					name: i18n.__('commands.serverInfo.guildRolesCount', {
						guildRolesCount,
					}),
					value: guildRoles,
				},
			],
			thumbnail: { url: guildIcon },
			author: { name: name, iconURL: guildIcon },
			footer: { text: guildId },
			timestamp: new Date(),
		};

		await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};
