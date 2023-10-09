const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder().setName("auth").setDescription("auth"),
  async execute(interaction) {
    const discordAuthUrl =
      "https://discord.com/api/oauth2/authorize?client_id=1041142645554163762&redirect_uri=https%3A%2F%2Fdiscord.gg%2FcuuKkJV6Hf&response_type=code&scope=identify";

    await interaction.reply(
      `Перейдите по ссылке для авторизации: ${discordAuthUrl}`
    );
  },
};
