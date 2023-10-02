const { Events, ChatInputCommandInteraction } = require("discord.js");
const { i18n } = require("../../config/i18nConfig");
const { getUserLocale } = require("../functions/locale/userLocale");
const botColors = require("../../config/botColors.json");
const botConfig = require("../../config/botConfig.json");
/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      const developerOnly = i18n.__("events.developerOnly");
      const botColor = parseInt(botColors.default);
      if (command.developer && interaction.user.id !== botConfig.onwerId)
        return interaction.reply({
          embeds: [{ color: botColor, description: developerOnly }],
          ephemeral: true,
        });

      const userLocale = getUserLocale(interaction);
      i18n.setLocale(userLocale);

      await command.execute(interaction, client);
    } else if (interaction.isModalSubmit()) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return;

      await modal.execute(interaction, client);
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return;

      await button.execute(interaction, client);
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const selectMenu = selectMenus.get(customId);

      if (!selectMenu) return;

      await selectMenu.execute(interaction, client);
    }
  },
  name: Events.InteractionCreate,
};
