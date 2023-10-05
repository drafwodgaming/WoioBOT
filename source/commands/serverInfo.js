const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { colors } = require("../../config/botConfig.json");
const moment = require("moment");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

const formatDate = (date) =>
  moment(date).format(i18n.__("time.defaultTimeFormat"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName(en.commands.serverInfo.name)
    .setDescription(en.commands.serverInfo.description)
    .setDescriptionLocalizations({
      ru: ru.commands.serverInfo.description,
      uk: uk.commands.serverInfo.description,
    })
    .setDMPermission(false),
  async execute(interaction) {
    const { guild } = interaction;
    const { createdAt, ownerId, name, description, memberCount } = guild;
    const membersCache = guild.members.cache;
    const channelsCache = guild.channels.cache;
    const emojisCache = guild.emojis.cache;
    const rolesCache = guild.roles.cache;

    moment.updateLocale(i18n.__("time.moment.momentLocale"), {
      weekdays: i18n.__("time.moment.momentWeekList").split("_"),
    });

    const guildName = name;
    const guildCreatedAt = formatDate(createdAt);
    const guildDescription = description;
    const guildMembersCount = membersCache.filter(
      (member) => !member.user.bot
    ).size;
    const botMembersCount = membersCache.size - guildMembersCount;
    const guildChannels = channelsCache.size;
    const textChannels = channelsCache.filter(
      (channel) => channel.type === ChannelType.GuildText
    ).size;
    const voiceChannels = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice
    ).size;
    const guildCategories = channelsCache.filter(
      (channel) => channel.type === ChannelType.GuildCategory
    ).size;

    const totalEmojisCount = emojisCache.size;
    const animatedEmojisCount = emojisCache.filter(
      (emoji) => emoji.animated
    ).size;
    const staticEmojisCount = emojisCache.size - animatedEmojisCount;

    const guildRoles = rolesCache
      .map((role) => role.toString())
      .slice(0, 15)
      .join(" ");
    const guildRolesCount = guild.roles.cache.map((role) => role.name).length;

    const guildInfoTitle = i18n.__("commands.serverInfo.title");
    const embedFields = [
      {
        name: i18n.__("commands.serverInfo.generalLabel"),
        value: [
          i18n.__("commands.serverInfo.guildName", { guildName }),
          i18n.__("commands.serverInfo.guildDescription", { guildDescription }),
          i18n.__("commands.serverInfo.owner", { ownerId }),
          i18n.__("commands.serverInfo.createdAt", { guildCreatedAt }),
        ].join("\n"),
      },
      {
        name: i18n.__("commands.serverInfo.totalMembersCount", { memberCount }),
        value: [
          i18n.__("commands.serverInfo.guildMembersCount", {
            guildMembersCount,
          }),
          i18n.__("commands.serverInfo.guildBotsCount", { botMembersCount }),
        ].join("\n"),
      },
      {
        name: i18n.__("commands.serverInfo.totalChannelsCount", {
          guildChannels,
        }),
        value: [
          i18n.__("commands.serverInfo.textChannelsCount", { textChannels }),
          i18n.__("commands.serverInfo.voiceChannelsCount", { voiceChannels }),
          i18n.__("commands.serverInfo.categoriesCount", { guildCategories }),
        ].join("\n"),
      },
      {
        name: i18n.__("commands.serverInfo.totalEmojisCount", {
          totalEmojisCount,
        }),
        value: [
          i18n.__("commands.serverInfo.animatedEmojisCount", {
            animatedEmojisCount,
          }),
          i18n.__("commands.serverInfo.staticEmojisCount", {
            staticEmojisCount,
          }),
        ].join("\n"),
      },
      {
        name: i18n.__("commands.serverInfo.guildRolesCount", {
          guildRolesCount,
        }),
        value: guildRoles,
      },
    ];
    const defaultBotColor = parseInt(colors.default);
    const guildIconThumbnail = {
      url: guild.iconURL(),
    };
    await interaction.reply({
      embeds: [
        {
          color: defaultBotColor,
          title: guildInfoTitle,
          thumbnail: guildIconThumbnail,
          fields: embedFields,
        },
      ],
    });
  },
};
