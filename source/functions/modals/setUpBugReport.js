const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { i18n } = require("../../../config/i18nConfig");
const { modals } = require("../../../config/componentsId.json");

function bugReport(bugReportId, bugReportLabel) {
  const modal = new ModalBuilder()
    .setCustomId(bugReportId)
    .setTitle(bugReportLabel);

  const bugCommandInput = new TextInputBuilder()
    .setCustomId(modals.bugCommand)
    .setLabel(i18n.__("components.modals.bugReport.bugCommandInput.label"))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(
      i18n.__("components.modals.bugReport.bugCommandInput.placeholder")
    );

  const bugCommandRow = new ActionRowBuilder().addComponents(bugCommandInput);

  const bugDescriptionInput = new TextInputBuilder()
    .setCustomId(modals.bugDescription)
    .setLabel(i18n.__("components.modals.bugReport.bugDescriptionInput.label"))
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(
      i18n.__("components.modals.bugReport.bugDescriptionInput.placeholder")
    );

  const bugDescriptionRow = new ActionRowBuilder().addComponents(
    bugDescriptionInput
  );

  modal.addComponents(bugCommandRow, bugDescriptionRow);

  return modal;
}
module.exports = { bugReport };
