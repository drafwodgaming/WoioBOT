const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const { i18n } = require('@config/i18nConfig');
const { getColor } = require('@source/functions/utils/getColor');
const joinToCreateSchema = require('@source/models/joinToCreate');
const { addChannel } = require('@source/functions/utils/addChannelToDB');
const {
	deleteChannel,
} = require('@source/functions/utils/deleteChannelFromDB');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.joinToCreateChannel.name)
		.setDescription(en.commands.joinToCreateChannel.selectJoinToCreateChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.joinToCreateChannel.selectJoinToCreateChannel,
			uk: uk.commands.joinToCreateChannel.selectJoinToCreateChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.setup)
				.setDescription(en.commands.joinToCreateChannel.setupChannel)
				.addChannelOption(option =>
					option
						.setName(en.commands.options.channelOption)
						.setDescription(en.commands.joinToCreateChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ru.commands.joinToCreateChannel.channelOption,
							uk: uk.commands.joinToCreateChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildVoice)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.disable)
				.setDescription(en.commands.joinToCreateChannel.disableChannel)
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

		const noChannelMessage = i18n.__('commands.joinToCreateChannel.noChannel', {
			warningEmoji,
		});
		const deletedChannelMessage = i18n.__(
			'commands.joinToCreateChannel.deletedChannel'
		);

		let joinToCreateChannel, responseEmbed;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				joinToCreateChannel = await joinToCreateSchema.findOne({
					guildId: interactionGuildId,
				});

				const editChannelDescription = i18n.__(
					'commands.joinToCreateChannel.editedChannel',
					{ channelId: interactionChannel.id }
				);

				const installChannelDescription = i18n.__(
					'commands.joinToCreateChannel.installedChannel',
					{ channelId: interactionChannel.id }
				);

				responseEmbed = {
					color: joinToCreateChannel ? editBlueColor : installGreenColor,
					description: joinToCreateChannel
						? editChannelDescription
						: installChannelDescription,
				};

				joinToCreateChannel = await addChannel(
					interactionGuildId,
					interactionChannel.id,
					joinToCreateSchema
				);
				break;

			case en.commands.subcommands.disable:
				joinToCreateChannel = await deleteChannel(
					interactionGuildId,
					joinToCreateSchema
				);

				responseEmbed = {
					color: joinToCreateChannel ? errorRedColor : defaultBotColor,
					description: joinToCreateChannel
						? deletedChannelMessage
						: noChannelMessage,
				};
				break;
		}
		await interaction.reply({
			embeds: [responseEmbed],
			ephemeral: true,
		});
	},
};
