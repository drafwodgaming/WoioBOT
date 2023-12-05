const { SlashCommandBuilder } = require('discord.js');
const { i18n } = require('../../config/i18nConfig');
const { getColor } = require('@source/functions/utils/getColor');
const moment = require('moment');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

const {
	getChannelsInfo,
} = require('@functions/utils/serverInfo/getChannelsInfo');
const { getEmojisInfo } = require('@functions/utils/serverInfo/getEmojisInfo');
const { getRolesInfo } = require('@functions/utils/serverInfo/getRolesInfo');

const formatDate = date =>
	moment(date).format(i18n.__('time.defaultTimeFormat'));

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
		const { createdAt, ownerId, name, description, memberCount } = guild;
		const membersCache = guild.members.cache;
		const channelsCache = guild.channels.cache;
		const emojisCache = guild.emojis.cache;
		const rolesCache = guild.roles.cache;

		moment.updateLocale(i18n.__('time.moment.momentLocale'), {
			weekdays: i18n.__('time.moment.momentWeekList').split('_'),
		});

		const guildName = name;
		const guildCreatedAt = formatDate(createdAt);
		const guildDescription = description;
		const guildMembersCount = membersCache.filter(
			member => !member.user.bot
		).size;
		const botMembersCount = membersCache.size - guildMembersCount;
		const { guildChannels, textChannels, voiceChannels, guildCategories } =
			await getChannelsInfo(channelsCache);
		const { totalEmojisCount, animatedEmojisCount, staticEmojisCount } =
			await getEmojisInfo(emojisCache);
		const { guildRoles, guildRolesCount } = await getRolesInfo(rolesCache);

		const guildInfoTitle = i18n.__('commands.serverInfo.title');
		const embedFields = [
			{
				name: i18n.__('commands.serverInfo.generalLabel'),
				value: [
					i18n.__('commands.serverInfo.guildName', { guildName }),
					i18n.__('commands.serverInfo.guildDescription', { guildDescription }),
					i18n.__('commands.serverInfo.owner', { ownerId }),
					i18n.__('commands.serverInfo.createdAt', { guildCreatedAt }),
				].join('\n'),
			},
			{
				name: i18n.__('commands.serverInfo.totalMembersCount', { memberCount }),
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
					i18n.__('commands.serverInfo.textChannelsCount', { textChannels }),
					i18n.__('commands.serverInfo.voiceChannelsCount', { voiceChannels }),
					i18n.__('commands.serverInfo.categoriesCount', { guildCategories }),
				].join('\n'),
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
		];
		const defaultBotColor = getColor('default');
		const guildIconThumbnail = {
			url: guild.iconURL(),
		};
		await interaction.reply({
			embeds: [
				{
					color: defaultBotColor,
					title: guildInfoTitle,
					thumbnail: guildIconThumbnail,
					fields: embedFields,
				},
			],
		});
	},
};
