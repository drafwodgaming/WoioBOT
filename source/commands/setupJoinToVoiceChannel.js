const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const {
	updateRecordField,
} = require('@functions/utils/database/updateRecordField');
const {
	deleteRecordField,
} = require('@functions/utils/database/deleteRecordField');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@source/functions/locale/getLocale');
const mustache = require('mustache');

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
				.setDescriptionLocalizations({
					ru: ru.commands.joinToCreateChannel.setupChannel,
					uk: uk.commands.joinToCreateChannel.setupChannel,
				})
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
				.setDescriptionLocalizations({
					ru: ru.commands.joinToCreateChannel.disableChannel,
					uk: uk.commands.joinToCreateChannel.disableChannel,
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

		const joinToCreateSchema = interaction.client.models.get('joinToCreate');

		const noChannelMessage = mustache.render(
			localizedText.commands.joinToCreateChannel.noChannel,
			{ warningEmoji }
		);
		const deletedChannelMessage = mustache.render(
			localizedText.commands.joinToCreateChannel.deletedChannel
		);
		let responseEmbed;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				const updateData = await updateRecordField(
					joinToCreateSchema,
					{ guildId: interactionGuildId },
					{ $set: { channelId: interactionChannel.id } }
				);

				const editChannelDescription = mustache.render(
					localizedText.commands.joinToCreateChannel.editedChannel,
					{ channelId: interactionChannel.id }
				);

				const installChannelDescription = mustache.render(
					localizedText.commands.joinToCreateChannel.installedChannel,
					{ channelId: interactionChannel.id }
				);

				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description: updateData
						? editChannelDescription
						: installChannelDescription,
				};
				break;

			case en.commands.subcommands.disable:
				const deletedData = await deleteRecordField(joinToCreateSchema, {
					guildId: interactionGuildId,
				});
				responseEmbed = {
					color: deletedData ? errorRedColor : defaultBotColor,
					description: deletedData ? deletedChannelMessage : noChannelMessage,
				};
				break;
		}
		await interaction.reply({
			embeds: [responseEmbed],
			ephemeral: true,
		});
	},
};
