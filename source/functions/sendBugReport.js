const { i18n } = require("../../config/i18nConfig");
const { reportDelete } = require("../functions/buttons/setUpReportSave");
const { buttons } = require("../../config/componentsId.json");
const { colors, onwerId } = require("../../config/botConfig.json");

async function sendBugReport(interaction, client, bugCommand, bugDescription) {
  const { user } = interaction;
  const botOwnerId = onwerId;
  const botColor = parseInt(colors.editBlue);
  const reportSent = i18n.__("components.modals.bugReport.reportSent");
  const embedTitle = `Report from ${user.displayName}`;
  const embedFields = [
    { name: "Chat Command", value: bugCommand },
    { name: "Description", value: bugDescription },
  ];
  const botOwner = await client.users.fetch(botOwnerId);
  const idButton = buttons.deleteReport;

  await botOwner.send({
    embeds: [{ color: botColor, title: embedTitle, fields: embedFields }],
    components: [reportDelete(idButton)],
  });

  await interaction.reply({
    embeds: [{ color: botColor, description: reportSent }],
    ephemeral: true,
  });
}
module.exports = { sendBugReport };
