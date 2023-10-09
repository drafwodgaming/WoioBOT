const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { i18n } = require("@config/i18nConfig");
const { colors } = require("@config/botConfig.json");
const welcomeChannelSchema = require("@source/models/welcomeChannel");
const emojis = require("@config/emojis.json");
const settings = require("@config/commands.json");
const en = require("@config/languages/en.json");
const ru = require("@config/languages/ru.json");
const uk = require("@config/languages/uk.json");

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
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.welcomeChannel.setupChannel)
        .setDescriptionLocalizations({
          ru: ru.commands.welcomeChannel.setupChannel,
          uk: uk.commands.welcomeChannel.setupChannel,
        })
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption)
            .setDescription(en.commands.welcomeChannel.channelOption)
            .setDescriptionLocalizations({
              ru: ru.commands.welcomeChannel.channelOption,
              uk: uk.commands.welcomeChannel.channelOption,
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.welcomeChannel.disableChannel)
        .setDescriptionLocalizations({
          ru: ru.commands.welcomeChannel.disableChannel,
          uk: uk.commands.welcomeChannel.disableChannel,
        })
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const subCommand = options.getSubcommand();
    const defaultBotColor = parseInt(colors.default);
    const installGreenColor = parseInt(colors.succesGreen);
    const editBlueColor = parseInt(colors.editBlue);
    const errorRedColor = parseInt(colors.errorRed);
    const interactionChannel = options.getChannel("channel");
    const interactionGuildId = guild.id;
    const warningEmoji = emojis.goldWarning;

    const noChannelMessage = i18n.__("commands.welcomeChannel.noChannel", {
      warningEmoji,
    });
    const deletedChannelMessage = i18n.__(
      "commands.welcomeChannel.deletedChannel"
    );

    let welcomeChannel, responseEmbed;

    switch (subCommand) {
      case settings.setup.name:
        welcomeChannel = await welcomeChannelSchema.findOne({
          guildId: interactionGuildId,
        });

        const editChannelDescription = i18n.__(
          "commands.welcomeChannel.editedChannel",
          { channelId: interactionChannel.id }
        );

        const installChannelDescription = i18n.__(
          "commands.welcomeChannel.installedChannel",
          { channelId: interactionChannel.id }
        );

        responseEmbed = {
          color: welcomeChannel ? editBlueColor : installGreenColor,
          description: welcomeChannel
            ? editChannelDescription
            : installChannelDescription,
        };

        if (welcomeChannel) {
          welcomeChannel.channelId = interactionChannel.id;
          welcomeChannel.guildId = interactionGuildId;
          await welcomeChannel.save();
        } else {
          const newChannelId = new welcomeChannelSchema({
            channelId: interactionChannel.id,
            guildId: interactionGuildId,
          });
          await newChannelId.save();
        }
        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        break;

      case settings.disable.name:
        welcomeChannel = await welcomeChannelSchema.findOneAndDelete({
          guildId: interactionGuildId,
        });

        responseEmbed = {
          color: welcomeChannel ? errorRedColor : defaultBotColor,
          description: welcomeChannel
            ? deletedChannelMessage
            : noChannelMessage,
        };

        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        break;
    }
  },
};
