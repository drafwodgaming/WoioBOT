const { Events, ChatInputCommandInteraction } = require('discord.js');
const { onwerId } = require('@config/botConfig.json');
const { getColor } = require('@functions/utils/getColor');
const { getLocalizedText } = require('@source/functions/locale/getLocale');

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

		const localizedText = await getLocalizedText(interaction);

		// const userLocale = getUserLocale(interaction);
		// i18n.setLocale(userLocale);

		switch (true) {
			case isChatInputCommand:
				const command = interaction.client.commands.get(
					interaction.commandName
				);

				if (!command) return;

				const developerOnlyMessage = localizedText.events.developerOnly;
				const defaultBotColor = getColor('default');
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
