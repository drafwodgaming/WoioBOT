const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	ChatInputCommandInteraction,
} = require('discord.js');
const { getColor } = require('@functions/utils/getColor');
const emojis = require('@config/emojis.json');
const en = require('@config/languages/en.json');
const ru = require('@config/languages/ru.json');
const uk = require('@config/languages/uk.json');
const { getLocalizedText } = require('@functions/locale/getLocale');
const mustache = require('mustache');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(en.commands.leaveChannel.name)
		.setDescription(en.commands.leaveChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.leaveChannel.selectChannel,
			uk: uk.commands.leaveChannel.selectChannel,
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
		)
		.setDMPermission(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { guild, options } = interaction;
		const localizedText = await getLocalizedText(interaction);
		const subCommand = options.getSubcommand();
		const { defaultBotColor, installGreenColor, editBlueColor, errorRedColor } =
			{
				defaultBotColor: getColor('default'),
				installGreenColor: getColor('succesGreen'),
				editBlueColor: getColor('editBlue'),
				errorRedColor: getColor('errorRed'),
			};

		const channelOption = options.getChannel(en.commands.options.channelOption);

		const guildId = guild.id;
		const warningEmoji = emojis.warning;

		const leaveChannelSchema = interaction.client.models.get('leaveChannel');

		let responseEmbed;
		let description;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				const updateData = await leaveChannelSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(localizedText.commands.leaveChannel.editedChannel, {
							channelId: channelOption.id,
					  })
					: mustache.render(
							localizedText.commands.leaveChannel.installedChannel,
							{ channelId: channelOption.id }
					  );

				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				break;

			case en.commands.subcommands.disable:
				const deletedData = await leaveChannelSchema.findOneAndDelete({
					guildId,
				});

				description = deletedData
					? mustache.render(localizedText.commands.leaveChannel.deletedChannel)
					: mustache.render(localizedText.commands.leaveChannel.noChannel, {
							warningEmoji,
					  });

				responseEmbed = {
					color: deletedData ? errorRedColor : defaultBotColor,
					description,
				};
				break;
		}
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	},
};
