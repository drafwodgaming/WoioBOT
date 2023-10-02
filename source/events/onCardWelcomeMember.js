const { Events } = require("discord.js");
const {
  cardWelcomeMessage,
} = require("../functions/canvases/setUpCardWelcomeMessage");
const welcomeChannelSchema = require("../models/welcomeChannel");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const { guild, user } = member;

    const interactionChannelId = await welcomeChannelSchema.findOne({
      guildId: guild.id,
    });

    if (!interactionChannelId) return;

    const welcomeChannel = guild.channels.cache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );
    // if (!welcomeChannel || user.bot) return;

    const welcomeMessage = await cardWelcomeMessage(member);
    await welcomeChannel.send({ files: [welcomeMessage] }).catch((err) => {
      return;
    });
  },
};
