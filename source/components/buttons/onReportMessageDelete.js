const customId = require("../../../config/customId.json");

module.exports = {
  data: {
    name: customId.buttons.deleteReport,
  },
  async execute(interaction, client) {
    const { channelId, message } = interaction;
    await client.channels.fetch(channelId);

    await message.delete();
  },
};
