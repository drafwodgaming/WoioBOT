const { SlashCommandBuilder, ChannelType, bold } = require('discord.js');
const mustache = require('mustache');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const emojis = require('@config/emojis.json');
const { getLocalizedText } = require('@functions/locale/getLocale');

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
		const { name, ownerId, createdTimestamp } = guild;

		const guildId = guild.id;

		const localizedText = await getLocalizedText(interaction);

		const defaultBotColor = getColor('default');

		const guildMembersCount = members.cache.filter(
			member => !member.user.bot
		).size;
		const botMembersCount = members.cache.size - guildMembersCount;
		const totalMembersCount = members.cache.size;

		const guildIcon = guild.iconURL();

		const textChannelsIco = emojis.textChannel;
		const voiceChannelsIco = emojis.voiceChannel;
		const categoriesIco = emojis.category;
		const annnouncementChannelIco = emojis.announcement;
		const stageChannelIco = emojis.stage;
		const forumIco = emojis.forum;

		const guildChannels = channels.cache.size;
		const guildCategories = channels.cache.filter(
			c => c.type === ChannelType.GuildCategory
		).size;
		const textChannels = channels.cache.filter(
			c => c.type === ChannelType.GuildText
		).size;
		const voiceChannels = channels.cache.filter(
			channel => channel.type === ChannelType.GuildVoice
		).size;
		const annnouncementChannel = guild.channels.cache.filter(
			channel => channel.type === ChannelType.GuildAnnouncement
		).size;
		const stageChannel = channels.cache.filter(
			channel => channel.type === ChannelType.GuildStageVoice
		).size;
		const forum = channels.cache.filter(
			channel => channel.type === ChannelType.GuildForum
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
			localizedText.commands.serverInfo.noDescription;

		const serverInfoEmbed = {
			color: defaultBotColor,
			description: bold(description),
			fields: [
				{
					name: localizedText.commands.serverInfo.generalLabel,
					value: [
						mustache.render(localizedText.commands.serverInfo.ownerId, {
							ownerId,
						}),
						mustache.render(localizedText.commands.serverInfo.createdAt, {
							guildCreatedAt: `<t:${parseInt(createdTimestamp / 1000)}:R>`,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(
						localizedText.commands.serverInfo.totalMembersCount,
						{ totalMembersCount }
					),
					value: [
						mustache.render(
							localizedText.commands.serverInfo.guildMembersCount,
							{ guildMembersCount }
						),
						mustache.render(localizedText.commands.serverInfo.guildBotsCount, {
							botMembersCount,
						}),
					].join('\n'),
				},
				{
					name: mustache.render(
						localizedText.commands.serverInfo.totalChannelsCount,
						{ guildChannels }
					),
					value: [
						mustache.render(
							localizedText.commands.serverInfo.textChannelsCount,
							{ textChannelsIco, textChannels }
						),
						mustache.render(
							localizedText.commands.serverInfo.voiceChannelsCount,
							{ voiceChannelsIco, voiceChannels }
						),
						mustache.render(localizedText.commands.serverInfo.categoriesCount, {
							categoriesIco,
							guildCategories,
						}),
						mustache.render(
							localizedText.commands.serverInfo.annnouncementChannelsCount,
							{ annnouncementChannelIco, annnouncementChannel }
						),
						mustache.render(
							localizedText.commands.serverInfo.stageChannelsCount,
							{ stageChannelIco, stageChannel }
						),
						mustache.render(localizedText.commands.serverInfo.forumCount, {
							forumIco,
							forum,
						}),
					].join(' | '),
				},
				{
					name: mustache.render(
						localizedText.commands.serverInfo.totalEmojisCount,
						{ totalEmojisCount }
					),
					value: [
						mustache.render(
							localizedText.commands.serverInfo.animatedEmojisCount,
							{ animatedEmojisCount }
						),
						mustache.render(
							localizedText.commands.serverInfo.staticEmojisCount,
							{ staticEmojisCount }
						),
					].join('\n'),
				},
				{
					name: mustache.render(
						localizedText.commands.serverInfo.guildRolesCount,
						{ guildRolesCount }
					),
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
