const { sendBugReport } = require("../../functions/sendBugReport");
const { modals } = require("../../../config/componentsId.json");

module.exports = {
  data: {
    name: modals.bugReport,
  },
  async execute(interaction, client) {
    const bugCommandInput = interaction.fields.getTextInputValue(
      modals.bugCommand
    );
    const bugDescriptionInput = interaction.fields.getTextInputValue(
      modals.bugDescription
    );

    await sendBugReport(
      interaction,
      client,
      bugCommandInput,
      bugDescriptionInput
    );
  },
};
