const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  inlineCode,
} = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { profileImage } = require("discord-arts");
const { addBadges } = require("../functions/userBadges");
const { colors } = require("../../config/botConfig.json");
const settings = require("../../config/commands.json");
const moment = require("moment");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

const formatDate = (date, locale) =>
  moment(date).format(i18n.__("time.defaultTimeFormat"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName(en.commands.userInfo.name)
    .setDescription(en.commands.userInfo.description)
    .setDescriptionLocalizations({
      ru: ru.commands.userInfo.description,
      uk: uk.commands.userInfo.description,
    })
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName(settings.userOption)
        .setDescription(en.commands.userInfo.userOption)
        .setDescriptionLocalizations({
          ru: ru.commands.userInfo.userOption,
          uk: uk.commands.userInfo.userOption,
        })
        .setRequired(false)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const { options, member } = interaction;
    const { createdAt, joinedAt } = member;

    moment.updateLocale(i18n.__("time.moment.momentLocale"), {
      weekdays: i18n.__("time.moment.momentWeekList").split("_"),
    });

    const targetUser = options.getMember(settings.userOption) || member;
    const profileBuffer = await profileImage(targetUser.id, {
      badgesFrame: true,
    });
    const imageAttachment = new AttachmentBuilder(profileBuffer, {
      name: "profile.png",
    });
    const userCreatedAt = formatDate(createdAt);
    const memberJoinedTime = formatDate(joinedAt);
    const statusList = {
      online: i18n.__("commands.userInfo.online"),
      idle: i18n.__("commands.userInfo.idle"),
      offline: i18n.__("commands.userInfo.offline"),
      dnd: i18n.__("commands.userInfo.dnd"),
    };
    const userBadges = targetUser.user.flags.toArray();

    const memberRoles = targetUser.roles.cache
      .map((role) => role)
      .sort((a, b) => b.position - a.position)
      .map((role) => role)
      .slice(0, 3)
      .join(" ");

    const userBadgesDescription = `${addBadges(userBadges).join(" ")}`;

    const embedTitle = i18n.__("commands.userInfo.title");
    const embedFields = [
      {
        name: i18n.__("commands.userInfo.createdAt"),
        value: i18n.__("commands.userInfo.createdTime", {
          createdAt: userCreatedAt,
        }),
        inline: false,
      },
      {
        name: i18n.__("commands.userInfo.joinedAt"),
        value: i18n.__("commands.userInfo.joinedTime", { memberJoinedTime }),
        inline: true,
      },
      {
        name: i18n.__("commands.userInfo.statusLabel"),
        value: i18n.__("commands.userInfo.userStatus", {
          statusList:
            statusList[
              targetUser.presence
                ? targetUser.presence.status
                : locales[locale].bot.presence.offline
            ],
        }),
        inline: true,
      },
      {
        name: i18n.__("commands.userInfo.memberRoles"),
        value: memberRoles || i18n.__("commands.userInfo.emptyRolesList"),
      },
    ];
    const botColor = parseInt(colors.default);

    const imageEmbed = {
      url: "attachment://profile.png",
    };
    await interaction.editReply({
      embeds: [
        {
          color: botColor,
          title: embedTitle,
          description: userBadgesDescription,
          fields: embedFields,
          image: imageEmbed,
        },
      ],
      files: [imageAttachment],
    });
  },
};
