const { SlashCommandBuilder } = require("discord.js");
const { bugReport } = require("../functions/modals/setUpBugReport");
const { i18n } = require("../../config/i18nConfig");
const { modals } = require("../../config/componentsId.json");
const en = require("../../config/languages/en.json");
const ru = require("../../config/languages/ru.json");
const uk = require("../../config/languages/uk.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(en.commands.bugReport.name)
    .setDescription(en.commands.bugReport.description)
    .setDescriptionLocalizations({
      ru: ru.commands.bugReport.description,
      uk: uk.commands.bugReport.description,
    }),
  async execute(interaction) {
    const titleModal = i18n.__("components.modals.bugReport.title");
    const idModal = modals.bugReport;

    await interaction.showModal(bugReport(idModal, titleModal));
  },
};
