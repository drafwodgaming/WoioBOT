const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { getColor } = require('@functions/utils/getColor');
const leaveChannelSchema = require('@source/models/leaveChannel');
const { addChannel } = require('@functions/utils/addChannelToDB');
const { deleteChannel } = require('@functions/utils/deleteChannelFromDB');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.leaveChannel.name)
		.setDescription(en.commands.leaveChannel.selectLeaveChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.leaveChannel.selectLeaveChannel,
			uk: uk.commands.leaveChannel.selectLeaveChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.setup)
				.setDescription(en.commands.leaveChannel.setupChannel)
				.setDescriptionLocalizations({
					ru: ru.commands.leaveChannel.setupChannel,
					uk: uk.commands.leaveChannel.setupChannel,
				})
				.addChannelOption(option =>
					option
						.setName(en.commands.options.channelOption)
						.setDescription(en.commands.leaveChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ru.commands.leaveChannel.channelOption,
							uk: uk.commands.leaveChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.disable)
				.setDescription(en.commands.leaveChannel.disableChannel)
				.setDescriptionLocalizations({
					ru: ru.commands.leaveChannel.disableChannel,
					uk: uk.commands.leaveChannel.disableChannel,
				})
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, options } = interaction;
		const subCommand = options.getSubcommand();
		const defaultBotColor = getColor('default');
		const installGreenColor = getColor('succesGreen');
		const editBlueColor = getColor('editBlue');
		const errorRedColor = getColor('errorRed');
		const interactionChannel = options.getChannel(
			en.commands.options.channelOption
		);
		const interactionGuildId = guild.id;
		const warningEmoji = emojis.goldWarning;

		const noChannelMessage = i18n.__('commands.leaveChannel.noChannel', {
			warningEmoji,
		});
		const deletedChannelMessage = i18n.__(
			'commands.leaveChannel.deletedChannel'
		);

		let leaveChannel, responseEmbed;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				leaveChannel = await leaveChannelSchema.findOne({
					guildId: interactionGuildId,
				});

				const editChannelDescription = i18n.__(
					'commands.leaveChannel.editedChannel',
					{ channelId: interactionChannel.id }
				);

				const installChannelDescription = i18n.__(
					'commands.leaveChannel.installedChannel',
					{ channelId: interactionChannel.id }
				);

				responseEmbed = {
					color: leaveChannel ? editBlueColor : installGreenColor,
					description: leaveChannel
						? editChannelDescription
						: installChannelDescription,
				};

				leaveChannel = await addChannel(
					interactionGuildId,
					interactionChannel.id,
					leaveChannelSchema
				);
				break;

			case en.commands.subcommands.disable:
				leaveChannel = await deleteChannel(
					interactionGuildId,
					leaveChannelSchema
				);

				responseEmbed = {
					color: leaveChannel ? errorRedColor : defaultBotColor,
					description: leaveChannel ? deletedChannelMessage : noChannelMessage,
				};
				break;
		}
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	},
};
