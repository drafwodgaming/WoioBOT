const { i18n } = require("../../../config/i18nConfig");
const { reportDelete } = require("../../functions/buttons/setUpReportSave");
const customId = require("../../../config/customId.json");
const botColors = require("../../../config/botColors.json");
const botConfig = require("../../../config/botConfig.json");

module.exports = {
  data: {
    name: customId.modals.bugReport,
  },
  async execute(interaction, client) {
    const { user } = interaction;
    const botOwnerId = botConfig.onwerId;
    const botColor = parseInt(botColors.editBlue);
    const bugCommand = interaction.fields.getTextInputValue(
      customId.modals.bugCommand
    );
    const bugDescription = interaction.fields.getTextInputValue(
      customId.modals.bugDescription
    );
    const reportSent = i18n.__("components.modals.bugReport.reportSent");
    const embedTitle = `Report from ${user.displayName}`;
    const embedFields = [
      { name: "Chat Command", value: bugCommand },
      { name: "Description", value: bugDescription },
    ];
    const botOwner = await client.users.fetch(botOwnerId);
    const idButton = customId.buttons.deleteReport;
    await botOwner.send({
      embeds: [{ color: botColor, title: embedTitle, fields: embedFields }],
      components: [reportDelete(idButton)],
    });

    await interaction.reply({
      embeds: [{ color: botColor, description: reportSent }],
      ephemeral: true,
    });
  },
};
