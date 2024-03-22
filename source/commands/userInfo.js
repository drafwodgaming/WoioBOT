const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	AttachmentBuilder,
} = require('discord.js');
const { profileImage } = require('discord-arts');
const { getColor } = require('@functions/utils/getColor');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');
const {
	getStatusText,
} = require('@source/functions/utils/userInfo/getStatusText');

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
		)
		.setDMPermission(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply();
		const localizedText = await getLocalizedText(interaction);
		const defaultBotColor = getColor('default');
		const { options, member } = interaction;

		const targetUser =
			options.getMember(en.commands.options.userOption) || member;

		const userCreatedAt = targetUser.user.createdAt;

		const profileImageBuffer = await profileImage(targetUser.id, {
			badgesFrame: true,
		});
		const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
			name: 'profile.png',
		});
		const memberJoinedTime = targetUser.joinedAt;
		const roleCache = targetUser.roles.cache.map(role => role);

		const userRoles = roleCache
			.filter(role => role.id !== targetUser.guild.roles.everyone.id)
			.slice(0, 3)
			.join(' ');

		const userRolesCount = targetUser.roles.cache.size;

		const { status = 'offline' } = targetUser.presence || {};
		const statusText = getStatusText(status, localizedText);
		const userInfoTitle = mustache.render(
			localizedText.commands.userInfo.title
		);
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
					name: mustache.render(localizedText.commands.userInfo.createdAt),
					value: mustache.render(localizedText.commands.userInfo.createdTime, {
						userCreatedAt: `<t:${Math.floor(userCreatedAt / 1000)}:R>`,
					}),
					inline: true,
				},
				{
					name: mustache.render(localizedText.commands.userInfo.joinedAt),
					value: mustache.render(localizedText.commands.userInfo.joinedTime, {
						memberJoinedTime: `<t:${Math.floor(memberJoinedTime / 1000)}:R>`,
					}),
					inline: true,
				},
				{
					name: mustache.render(localizedText.commands.userInfo.memberRoles),
					value:
						userRolesCount > 0
							? userRoles
							: mustache.render(localizedText.commands.userInfo.emptyRolesList),
				},
				{
					name: mustache.render(localizedText.commands.userInfo.statusLabel),
					value: statusText,
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
