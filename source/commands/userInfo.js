const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	AttachmentBuilder,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { profileImage } = require('discord-arts');
const { addBadges } = require('@source/functions/userBadges');
const { colors } = require('@config/botConfig.json');
const settings = require('@config/commands.json');
const moment = require('moment');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

const formatDate = date =>
	moment(date).format(i18n.__('time.defaultTimeFormat'));

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
				.setName(settings.userOption)
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
		const { options, member } = interaction;
		const targetUser = options.getMember(settings.userOption) || member;
		const rolesCache = targetUser.roles.cache;

		moment.updateLocale(i18n.__('time.moment.momentLocale'), {
			weekdays: i18n.__('time.moment.momentWeekList').split('_'),
		});

		const profileImageBuffer = await profileImage(targetUser.id, {
			badgesFrame: true,
		});
		const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
			name: 'profile.png',
		});
		const userCreatedAt = formatDate(targetUser.user.createdAt);
		const memberJoinedTime = formatDate(targetUser.joinedAt);
		const statusList = {
			online: i18n.__('commands.userInfo.online'),
			idle: i18n.__('commands.userInfo.idle'),
			offline: i18n.__('commands.userInfo.offline'),
			dnd: i18n.__('commands.userInfo.dnd'),
		};
		const userBadgesList = targetUser.user.flags.toArray();
		const userBadgesDescription = `${addBadges(userBadgesList).join(' ')}`;
		const memberRolesList = rolesCache
			.map(role => role)
			.slice(0, 3)
			.join(' ');

		const userInfoTitle = i18n.__('commands.userInfo.title');
		const embedFields = [
			{
				name: i18n.__('commands.userInfo.createdAt'),
				value: i18n.__('commands.userInfo.createdTime', { userCreatedAt }),
				inline: false,
			},
			{
				name: i18n.__('commands.userInfo.joinedAt'),
				value: i18n.__('commands.userInfo.joinedTime', { memberJoinedTime }),
				inline: true,
			},
			{
				name: i18n.__('commands.userInfo.statusLabel'),
				value: i18n.__('commands.userInfo.userStatus', {
					statusList:
						statusList[
							targetUser.presence ? targetUser.presence.status : 'offline'
						],
				}),
				inline: true,
			},
			{
				name: i18n.__('commands.userInfo.memberRoles'),
				value: memberRolesList || i18n.__('commands.userInfo.emptyRolesList'),
			},
		];
		const defaultBotColor = parseInt(colors.default);

		const imageEmbed = {
			url: 'attachment://profile.png',
		};
		await interaction.editReply({
			embeds: [
				{
					color: defaultBotColor,
					title: userInfoTitle,
					description: userBadgesDescription,
					fields: embedFields,
					image: imageEmbed,
				},
			],
			files: [imageAttachment],
		});
	},
};
