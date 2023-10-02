const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const logChannelSchema = require("../models/logChannel");
const { i18n } = require("../../config/i18nConfig");
const botColors = require("../../config/botColors.json");
const { emojis } = require("../../config/botConfig.json");
const settings = require("../../config/commands.json");

const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(en.commands.logChannel.name)
    .setDescription(en.commands.logChannel.selectLogChannel)
    .setDescriptionLocalizations({
      ru: ru.commands.logChannel.selectLogChannel,
      uk: uk.commands.logChannel.selectLogChannel,
    })
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.setup.name)
        .setDescription(en.commands.logChannel.setupChannel)
        .setDescriptionLocalizations({
          ru: ru.commands.logChannel.setupChannel,
          uk: uk.commands.logChannel.setupChannel,
        })
        .addChannelOption((option) =>
          option
            .setName(settings.channelOption)
            .setDescription(en.commands.logChannel.channelOption)
            .setDescriptionLocalizations({
              ru: ru.commands.logChannel.channelOption,
              uk: uk.commands.logChannel.channelOption,
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(settings.disable.name)
        .setDescription(en.commands.logChannel.disableChannel)
        .setDescriptionLocalizations({
          ru: ru.commands.logChannel.disableChannel,
          uk: uk.commands.logChannel.disableChannel,
        })
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const subCommand = options.getSubcommand();
    const botColor = parseInt(botColors.default);
    const installColor = parseInt(botColors.succesGreen);
    const editColor = parseInt(botColors.editBlue);
    const errorColor = parseInt(botColors.errorRed);
    const interactionChannel = options.getChannel(settings.channelOption);
    const interactionGuildId = guild.id;
    const warning = emojis.goldWarning;

    const noChannel = i18n.__("commands.logChannel.noChannel", { warning });
    const deletedChannel = i18n.__("commands.logChannel.deletedChannel");

    switch (subCommand) {
      case settings.setup.name:
        {
          const logChannel = await logChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = i18n.__(
            "commands.logChannel.editedChannel",
            { channelId: interactionChannel.id }
          );

          const installedChannelDescription = i18n.__(
            "commands.logChannel.installedChannel",
            { channelId: interactionChannel.id }
          );

          if (logChannel) {
            logChannel.channelId = interactionChannel.id;
            logChannel.guildId = interactionGuildId;
            await logChannel.save();
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
          const newChannelId = new logChannelSchema({
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
          const logChannel = await logChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          if (logChannel) {
            await interaction.reply({
              embeds: [{ color: errorColor, description: deletedChannel }],
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
