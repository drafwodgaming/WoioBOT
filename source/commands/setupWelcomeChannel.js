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
		.setName(en.commands.welcomeChannel.name)
		.setDescription(en.commands.welcomeChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.welcomeChannel.selectChannel,
			uk: uk.commands.welcomeChannel.selectChannel,
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

		const welcomeChannelSchema =
			interaction.client.models.get('welcomeChannel');

		let responseEmbed;
		let description;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				const updateData = await welcomeChannelSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(
							localizedText.commands.welcomeChannel.editedChannel,
							{ channelId: channelOption.id }
					  )
					: mustache.render(
							localizedText.commands.welcomeChannel.installedChannel,
							{ channelId: channelOption.id }
					  );

				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				break;

			case en.commands.subcommands.disable:
				const deletedData = await welcomeChannelSchema.findOneAndDelete({
					guildId,
				});

				description = deletedData
					? mustache.render(
							localizedText.commands.welcomeChannel.deletedChannel
					  )
					: mustache.render(localizedText.commands.welcomeChannel.noChannel, {
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
