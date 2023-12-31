const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	AttachmentBuilder,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { profileImage } = require('discord-arts');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { formatDate } = require('@functions/utils/formatter/formatDate');
const emojis = require('@config/emojis.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.userInfo.name)
		.setDescription(en.commands.userInfo.description)
		.setDescriptionLocalizations({
			ru: ru.commands.userInfo.description,
			uk: uk.commands.userInfo.description,
		})
		.setDMPermission(false)
		.addUserOption(option =>
			option
				.setName(en.commands.options.userOption)
				.setDescription(en.commands.userInfo.userOption)
				.setDescriptionLocalizations({
					ru: ru.commands.userInfo.userOption,
					uk: uk.commands.userInfo.userOption,
				})
				.setRequired(false)
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply();
		const defaultBotColor = getColor('default');
		const { options, member } = interaction;
		const targetUser =
			options.getMember(en.commands.options.userOption) || member;

		const userCreatedAt = targetUser.createdAt;
		const userCreatedAtTimeFormatted = formatDate(userCreatedAt);

		const profileImageBuffer = await profileImage(targetUser.id, {
			badgesFrame: true,
		});
		const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
			name: 'profile.png',
		});
		const memberJoinedTime = targetUser.joinedAt;
		const memberJoinedTimeFormatted = formatDate(memberJoinedTime);
		const roleCache = targetUser.roles.cache.map(role => role);

		const userRoles = roleCache
			.filter(role => role.id !== targetUser.guild.roles.everyone.id)
			.slice(0, 3)
			.join(' ');

		const userRolesCount = targetUser.roles.cache.size;
		const userStatus = {
			online: i18n.__('commands.userInfo.online'),
			idle: i18n.__('commands.userInfo.idle'),
			offline: i18n.__('commands.userInfo.offline'),
			dnd: i18n.__('commands.userInfo.dnd'),
		};
		const statusList =
			userStatus[targetUser.presence ? targetUser.presence.status : 'offline'];

		const userInfoTitle = i18n.__('commands.userInfo.title');
		const imageEmbed = {
			url: 'attachment://profile.png',
		};

		const userInfoEmbed = {
			color: defaultBotColor,
			title: userInfoTitle,
			image: imageEmbed,
			timestamp: new Date(),
			fields: [
				{
					name: i18n.__('commands.userInfo.createdAt'),
					value: i18n.__('commands.userInfo.createdTime', {
						userCreatedAt: userCreatedAtTimeFormatted,
					}),
					inline: true,
				},
				{
					name: i18n.__('commands.userInfo.joinedAt'),
					value: i18n.__('commands.userInfo.joinedTime', {
						memberJoinedTime: memberJoinedTimeFormatted,
					}),
					inline: true,
				},
				{
					name: i18n.__('commands.userInfo.memberRoles'),
					value:
						userRolesCount > 0
							? userRoles
							: i18n.__('commands.userInfo.emptyRolesList'),
				},
				{
					name: i18n.__('commands.userInfo.statusLabel'),
					value: i18n.__('commands.userInfo.userStatus', { statusList }),
					inline: true,
				},
			],
		};
		await interaction.editReply({
			embeds: [userInfoEmbed],
			files: [imageAttachment],
		});
	},
};
