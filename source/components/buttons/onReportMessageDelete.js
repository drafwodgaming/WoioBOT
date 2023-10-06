const { buttons } = require("@config/componentsId.json");

module.exports = {
  data: {
    name: buttons.deleteReport,
  },
  async execute(interaction, client) {
    const { channelId, message } = interaction;
    await client.channels.fetch(channelId);

    await message.delete();
  },
};
