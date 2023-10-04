const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { colors } = require("../../config/botConfig.json");
const leaveChannelSchema = require("../models/leaveChannel");
const emojis = require("../../config/emojis.json");
const settings = require("../../config/commands.json");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

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
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.leaveChannel.setupChannel)
        .setDescriptionLocalizations({
          ru: ru.commands.leaveChannel.setupChannel,
          uk: uk.commands.leaveChannel.setupChannel,
        })
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption)
            .setDescription(en.commands.leaveChannel.channelOption)
            .setDescriptionLocalizations({
              ru: ru.commands.leaveChannel.channelOption,
              uk: uk.commands.leaveChannel.channelOption,
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
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
    const botColor = parseInt(colors.default);
    const installColor = parseInt(colors.succesGreen);
    const editColor = parseInt(colors.editBlue);
    const errorColor = parseInt(colors.errorRed);
    const interactionChannel = options.getChannel(settings.channelOption);
    const interactionGuildId = guild.id;
    const warning = emojis.goldWarning;

    const noChannel = i18n.__("commands.leaveChannel.noChannel", { warning });
    const deletedChannel = i18n.__("commands.leaveChannel.deletedChannel");

    switch (subCommand) {
      case settings.setup.name:
        {
          const leaveChannel = await leaveChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = i18n.__(
            "commands.leaveChannel.editedChannel",
            { channelId: interactionChannel.id }
          );

          const installedChannelDescription = i18n.__(
            "commands.leaveChannel.installedChannel",
            { channelId: interactionChannel.id }
          );

          if (leaveChannel) {
            leaveChannel.channelId = interactionChannel.id;
            leaveChannel.guildId = interactionGuildId;
            await leaveChannel.save();
            await interaction.reply({
              embeds: [
                {
                  color: editColor,
                  description: editChannelDescription,
                },
              ],
              ephemeral: true,
            });
            return;
          }
          const newChannelId = new leaveChannelSchema({
            channelId: interactionChannel.id,
            guildId: interactionGuildId,
          });
          await newChannelId.save();
          await interaction.reply({
            embeds: [
              {
                color: installColor,
                description: installedChannelDescription,
              },
            ],
            ephemeral: true,
          });
        }
        break;

      case settings.disable.name:
        {
          const leaveChannel = await leaveChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          if (leaveChannel) {
            await interaction.reply({
              embeds: [
                {
                  color: errorColor,
                  description: deletedChannel,
                },
              ],
              ephemeral: true,
            });
            return;
          }
          await interaction.reply({
            embeds: [{ color: botColor, description: noChannel }],
            ephemeral: true,
          });
        }
        break;
    }
  },
};
