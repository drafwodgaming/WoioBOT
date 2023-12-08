const { SlashCommandBuilder } = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { getColor } = require('@source/functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const {
	buildGeneralInfo,
} = require('@functions/utils/serverInfo/buildInfo/buildGeneralInfo');
const {
	buildChannelsInfo,
} = require('@functions/utils/serverInfo/buildInfo/buildChannelsInfo');
const {
	buildEmojisInfo,
} = require('@functions/utils/serverInfo/buildInfo/buildEmojisInfo');
const {
	buildMembersInfo,
} = require('@functions/utils/serverInfo/buildInfo/buildMembersInfo');
const {
	buildRolesInfo,
} = require('@functions/utils/serverInfo/buildInfo/buildRolesInfo');

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
		const { members, channels, emojis, roles } = guild;

		const membersCache = members.cache;
		const channelsCache = channels.cache;
		const emojisCache = emojis.cache;
		const rolesCache = roles.cache;

		const guildInfoTitle = i18n.__('commands.serverInfo.title');
		const generalInfo = await buildGeneralInfo(guild);
		const membersInfo = await buildMembersInfo(membersCache);
		const channelsInfo = await buildChannelsInfo(channelsCache);
		const emojisInfo = await buildEmojisInfo(emojisCache);
		const rolesInfo = await buildRolesInfo(rolesCache);

		const embedFields = [
			...generalInfo,
			...membersInfo,
			...channelsInfo,
			...emojisInfo,
			...rolesInfo,
		];

		const defaultBotColor = getColor('default');
		const guildIconThumbnail = {
			url: guild.iconURL(),
		};

		await interaction.deferReply();
		await interaction.editReply({
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
