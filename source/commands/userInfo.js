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
const {
	buildCreatedAtInfo,
} = require('@functions/utils/userInfo/buildInfo/buildCreatedAtInfo');
const {
	buildJoinedAtInfo,
} = require('@functions/utils/userInfo/buildInfo/buildJoinedAtInfo');
const {
	buildStatusLabelInfo,
} = require('@functions/utils/userInfo/buildInfo/buildStatusLabelInfo');
const {
	buildRolesInfo,
} = require('@functions/utils/userInfo/buildInfo/buildRolesInfo');

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
		const { options, member } = interaction;
		const targetUser =
			options.getMember(en.commands.options.userOption) || member;

		const profileImageBuffer = await profileImage(targetUser.id, {
			badgesFrame: true,
		});
		const imageAttachment = new AttachmentBuilder(profileImageBuffer, {
			name: 'profile.png',
		});

		const userCreatedAt = targetUser.user.createdAt;
		const memberJoinedTime = targetUser.joinedAt;

		const userInfoTitle = i18n.__('commands.userInfo.title');
		const createdAt = await buildCreatedAtInfo(userCreatedAt);
		const joinedAt = await buildJoinedAtInfo(memberJoinedTime);
		const userStatus = await buildStatusLabelInfo(targetUser);
		const rolesInfo = await buildRolesInfo(targetUser);
		const embedFields = [
			...createdAt,
			...joinedAt,
			...userStatus,
			...rolesInfo,
		];

		const defaultBotColor = getColor('default');

		const imageEmbed = {
			url: 'attachment://profile.png',
		};
		await interaction.editReply({
			embeds: [
				{
					color: defaultBotColor,
					title: userInfoTitle,
					fields: embedFields,
					image: imageEmbed,
				},
			],
			files: [imageAttachment],
		});
	},
};
