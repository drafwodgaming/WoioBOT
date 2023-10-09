const { Events, ChatInputCommandInteraction } = require("discord.js");
const { i18n } = require("@config/i18nConfig");
const { getUserLocale } = require("@source/functions/locale/userLocale");
const { colors, onwerId } = require("@config/botConfig.json");

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    const { customId } = interaction;
    const isChatInputCommand = interaction.isChatInputCommand();
    const isModalSubmit = interaction.isModalSubmit();
    const isButton = interaction.isButton();
    const isStringSelectMenu = interaction.isStringSelectMenu();

    const userLocale = getUserLocale(interaction);
    i18n.setLocale(userLocale);

    switch (true) {
      case isChatInputCommand:
        const command = interaction.client.commands.get(
          interaction.commandName
        );

        if (!command) return;

        const developerOnlyMessage = i18n.__("events.developerOnly");
        const defaultBotColor = parseInt(colors.default);
        if (command.developer && interaction.user.id !== onwerId) {
          return interaction.reply({
            embeds: [
              { color: defaultBotColor, description: developerOnlyMessage },
            ],
            ephemeral: true,
          });
        }

        await command.execute(interaction, client);
        break;

      case isModalSubmit:
        const { modals } = client;
        const modal = modals.get(customId);
        if (!modal) return;

        await modal.execute(interaction, client);
        break;

      case isButton:
        const { buttons } = client;
        const button = buttons.get(customId);
        if (!button) return;

        await button.execute(interaction, client);
        break;

      case isStringSelectMenu:
        const { selectMenus } = client;
        const selectMenu = selectMenus.get(customId);
        if (!selectMenu) return;

        await selectMenu.execute(interaction, client);
        break;
    }
  },
};
