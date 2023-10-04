const { SlashCommandBuilder, bold } = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { colors } = require("../../config/botConfig.json");
const { getUserLocale } = require("../functions/locale/userLocale");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(en.commands.help.name)
    .setDescription(en.commands.help.description)
    .setDescriptionLocalizations({
      ru: ru.commands.help.description,
      uk: uk.commands.help.description,
    }),
  async execute(interaction) {
    const buildCommandDescription = (commandsArray) =>
      commandsArray
        .map((command) => `/${bold(command.name)} \n ${command.description}\n`)
        .join("\n");

    const botColor = parseInt(colors.default);
    const embedTitle = i18n.__("commands.help.title");
    const embedDescription = buildCommandDescription(
      interaction.client.commandsArray
    );

    await interaction.reply({
      embeds: [
        {
          color: botColor,
          title: embedTitle,
          description: embedDescription,
        },
      ],
      ephemeral: true,
    });
  },
};
