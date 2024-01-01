const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const welcomeChannelSchema = require('@source/models/welcomeChannel');
const { addChannel } = require('@functions/utils/database/addChannelToDB');
const {
	deleteChannel,
} = require('@functions/utils/database/deleteChannelFromDB');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const mustache = require('mustache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.welcomeChannel.name)
		.setDescription(en.commands.welcomeChannel.selectWelcomeChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.welcomeChannel.selectWelcomeChannel,
			uk: uk.commands.welcomeChannel.selectWelcomeChannel,
		})
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.setup)
				.setDescription(en.commands.welcomeChannel.setupChannel)
				.setDescriptionLocalizations({
					ru: ru.commands.welcomeChannel.setupChannel,
					uk: uk.commands.welcomeChannel.setupChannel,
				})
				.addChannelOption(option =>
					option
						.setName(en.commands.options.channelOption)
						.setDescription(en.commands.welcomeChannel.channelOption)
						.setDescriptionLocalizations({
							ru: ru.commands.welcomeChannel.channelOption,
							uk: uk.commands.welcomeChannel.channelOption,
						})
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName(en.commands.subcommands.disable)
				.setDescription(en.commands.welcomeChannel.disableChannel)
				.setDescriptionLocalizations({
					ru: ru.commands.welcomeChannel.disableChannel,
					uk: uk.commands.welcomeChannel.disableChannel,
				})
		)
		.setDMPermission(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, options } = interaction;
		const localizedText = await getLocalizedText(interaction);
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

		const noChannelMessage = mustache.render(
			localizedText.commands.welcomeChannel.noChannel,
			{ warningEmoji }
		);
		const deletedChannelMessage = mustache.render(
			localizedText.commands.welcomeChannel.deletedChannel
		);

		let responseEmbed;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				const { isNew } = await addChannel(
					interactionGuildId,
					interactionChannel.id,
					welcomeChannelSchema
				);

				const editChannelDescription = mustache.render(
					localizedText.commands.welcomeChannel.editedChannel,
					{ channelId: interactionChannel.id }
				);

				const installChannelDescription = mustache.render(
					localizedText.commands.welcomeChannel.installedChannel,
					{ channelId: interactionChannel.id }
				);

				responseEmbed = {
					color: isNew ? installGreenColor : editBlueColor,
					description: isNew
						? installChannelDescription
						: editChannelDescription,
				};
				break;

			case en.commands.subcommands.disable:
				const isDeleted = await deleteChannel(guild.id, welcomeChannelSchema);

				responseEmbed = {
					color: isDeleted ? errorRedColor : defaultBotColor,
					description: isDeleted ? deletedChannelMessage : noChannelMessage,
				};
				break;
		}
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	},
};
