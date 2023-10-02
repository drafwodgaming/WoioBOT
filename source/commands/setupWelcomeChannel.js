const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { emojis } = require("../../config/botConfig.json");
const welcomeChannelSchema = require("../models/welcomeChannel");
const botColors = require("../../config/botColors.json");
const settings = require("../../config/commands.json");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

const localize = (key, locale, placeholders) => {
  const template = locales[locale].commands.welcomeChannel[key];
  return template.replace(/%\w+/g, (match) => placeholders[match] || match);
};

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
    const { guild, locale, options } = interaction;
    const subCommand = options.getSubcommand();
    const botColor = parseInt(botColors.default);
    const installColor = parseInt(botColors.succesGreen);
    const editColor = parseInt(botColors.editBlue);
    const errorColor = parseInt(botColors.errorRed);
    const interactionChannel = options.getChannel("channel");
    const interactionGuildId = guild.id;
    const warning = emojis.goldWarning;

    const noChannel = i18n.__("commands.welcomeChannel.noChannel", { warning });
    const deletedChannel = i18n.__("commands.welcomeChannel.deletedChannel");

    switch (subCommand) {
      case settings.setup.name:
        {
          const welcomeChannel = await welcomeChannelSchema.findOne({
            guildId: interactionGuildId,
          });

          const editChannelDescription = i18n.__(
            "commands.welcomeChannel.editedChannel",
            { channelId: interactionChannel.id }
          );

          const installedChannelDescription = i18n.__(
            "commands.welcomeChannel.installedChannel",
            { channelId: interactionChannel.id }
          );

          if (welcomeChannel) {
            welcomeChannel.channelId = interactionChannel.id;
            welcomeChannel.guildId = interactionGuildId;
            await welcomeChannel.save();
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

          const newChannelId = new welcomeChannelSchema({
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
          const welcomeChannel = await welcomeChannelSchema.findOneAndDelete({
            guildId: interactionGuildId,
          });

          if (welcomeChannel) {
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
