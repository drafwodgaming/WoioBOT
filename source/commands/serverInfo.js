const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const botColors = require("../../config/botColors.json");
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
    const {
      createdAt,
      ownerId,
      description,
      memberCount,
      channels,
      emojis,
      roles,
    } = guild;

    moment.updateLocale(i18n.__("time.moment.momentLocale"), {
      weekdays: i18n.__("time.moment.momentWeekList").split("_"),
    });

    const guildName = guild.name;
    const guildCreatedAt = formatDate(createdAt);
    const guildDescription = description || "";
    const guildMembers = guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    const botsNumber = guild.members.cache.filter(
      (member) => member.user.bot
    ).size;
    const guildChannels = channels.cache.size;
    const textChannels = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText
    ).size;
    const voiceChannels = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice
    ).size;
    const guildCategories = channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory
    ).size;
    const emojiCount = emojis.cache.size;
    const emojisAnimate = emojis.cache.filter((emoji) => emoji.animated).size;
    const emojisStatic = emojis.cache.filter((emoji) => !emoji.animated).size;
    const guildRoles = roles.cache
      .map((role) => role.toString())
      .slice(1, 15)
      .join(" ");
    const guildRolesLength = roles.cache.map((role) => role.name).length;

    const embedTitle = i18n.__("commands.serverInfo.title");
    const embedFields = [
      {
        name: i18n.__("commands.serverInfo.generalLabel"),
        value: `${i18n.__("commands.serverInfo.guildName", { guildName })}
          ${i18n.__("commands.serverInfo.guildDescription", {
            guildDescription,
          })}
          ${i18n.__("commands.serverInfo.owner", { ownerId })}
          ${i18n.__("commands.serverInfo.createdAt", { guildCreatedAt })}`,
      },
      {
        name: i18n.__("commands.serverInfo.totalGuildMembersCount", {
          memberCount,
        }),
        value: `${i18n.__("commands.serverInfo.guildMembersCount", {
          guildMembers,
        })}
          ${i18n.__("commands.serverInfo.guildBotsCount", { botsNumber })}`,
      },
      {
        name: i18n.__("commands.serverInfo.totalChannelsCount", {
          guildChannels,
        }),
        value: `${i18n.__("commands.serverInfo.guildTextChannelsCount", {
          textChannels,
        })}
          ${i18n.__("commands.serverInfo.guildVoiceChannelsCount", {
            voiceChannels,
          })}
          ${i18n.__("commands.serverInfo.guildCategoriesCount", {
            guildCategories,
          })}`,
      },
      {
        name: i18n.__("commands.serverInfo.totlaEmojisCount", { emojiCount }),
        value: `${i18n.__("commands.serverInfo.animatedEmojisCount", {
          emojisAnimate,
        })}
          ${i18n.__("commands.serverInfo.staticEmojisCount", {
            emojisStatic,
          })}`,
      },
      {
        name: i18n.__("commands.serverInfo.rolesCount", { guildRolesLength }),
        value: guildRoles,
      },
    ];
    const botColor = parseInt(botColors.default);
    const embedThumbnailImage = {
      url: guild.iconURL(),
    };
    await interaction.reply({
      embeds: [
        {
          color: botColor,
          title: embedTitle,
          thumbnail: embedThumbnailImage,
          fields: embedFields,
        },
      ],
    });
  },
};
