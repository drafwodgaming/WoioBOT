const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
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
		.setName(en.commands.joinToCreateChannel.name)
		.setDescription(en.commands.joinToCreateChannel.selectChannel)
		.setDescriptionLocalizations({
			ru: ru.commands.joinToCreateChannel.selectChannel,
			uk: uk.commands.joinToCreateChannel.selectChannel,
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
		const warningEmoji = emojis.warning;

		const joinToCreateSchema = interaction.client.models.get('joinToCreate');

		const guildId = guild.id;
		const channelOption = options.getChannel(en.commands.options.channelOption);

		let responseEmbed;
		let description;

		switch (subCommand) {
			case en.commands.subcommands.setup:
				const updateData = await joinToCreateSchema.findOneAndUpdate(
					{ guildId },
					{ $set: { channelId: channelOption.id } },
					{ upsert: true }
				);

				description = updateData
					? mustache.render(
							localizedText.commands.joinToCreateChannel.editedChannel,
							{ channelId: channelOption.id }
					  )
					: mustache.render(
							localizedText.commands.joinToCreateChannel.installedChannel,
							{ channelId: channelOption.id }
					  );
				responseEmbed = {
					color: updateData ? editBlueColor : installGreenColor,
					description,
				};
				break;
			case en.commands.subcommands.disable:
				const deletedData = await joinToCreateSchema.findOneAndDelete({
					guildId,
				});
				description = deletedData
					? mustache.render(
							localizedText.commands.joinToCreateChannel.deletedChannel
					  )
					: mustache.render(
							localizedText.commands.joinToCreateChannel.noChannel,
							{ warningEmoji }
					  );
				responseEmbed = {
					color: deletedData ? errorRedColor : defaultBotColor,
					description,
				};
				break;
		}
		await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	},
};
