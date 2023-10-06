const { Events } = require("discord.js");
const {
  cardWelcomeMessage,
} = require("@source/functions/canvases/setUpCardWelcomeMessage");
const welcomeChannelSchema = require("@source/models/welcomeChannel");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const { guild, user } = member;
    const channelsCache = guild.channels.cache;

    const interactionChannelId = await welcomeChannelSchema.findOne({
      guildId: guild.id,
    });

    const welcomeChannel = channelsCache.find(
      (channel) => channel.id === interactionChannelId.channelId
    );

    if (user.bot || !interactionChannelId || !welcomeChannel) return;

    const welcomeMessageCanvas = await cardWelcomeMessage(member);
    await welcomeChannel.send({ files: [welcomeMessageCanvas] });
  },
};
