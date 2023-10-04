const { Events } = require("discord.js");
const { colors } = require("../../config/botConfig.json");
const { stripIndents } = require("common-tags");
const logChannelSchema = require("../models/logChannel");
const mustache = require("mustache");
const moment = require("moment");
const en = require("../../config/languages/en");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    moment.updateLocale(en.time.moment.momentLocale, {
      weekdays: en.time.moment.momentWeekList.split("_"),
    });
    const interactionChannelId = await logChannelSchema.findOne({
      guildId: member.guild.id,
    });
    if (!interactionChannelId) return;
    const logChannel = member.guild.channels.cache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );
    const userTag = member.user.tag;
    const userName = member.user.id;

    if (!logChannel) return;

    const guildCreatedAt = moment(member.guild.createdAt).format(
      en.time.defaultTimeFormat
    );
    const userJoinTitle = en.bot.embeds.events.logChannelWelcome.title;
    const userJoinDescription = stripIndents`
    ${mustache.render(en.bot.embeds.events.logChannelWelcome.description, {
      userTag: userTag,
      userName: userName,
    })}
    ${mustache.render(en.bot.embeds.events.logChannelWelcome.createdAt, {
      guildCreatedAt: guildCreatedAt,
    })}
    `;
    const botColor = parseInt(colors.default);
    const embedThumbnailImage = {
      url: member.user.avatarURL(),
    };
    const timestamp = new Date().toISOString();
    const footer = {
      text: client.user.tag,
      iconUrl: client.user.displayAvatarURL(),
    };
    await logChannel.send({
      embeds: [
        {
          color: botColor,
          title: userJoinTitle,
          description: userJoinDescription,
          thumbnail: embedThumbnailImage,
          timestamp: timestamp,
          footer: footer,
        },
      ],
    });
  },
};
