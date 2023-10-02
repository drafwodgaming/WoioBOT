const { sendBugReport } = require("../../functions/sendBugReport");
const customId = require("../../../config/customId.json");

module.exports = {
  data: {
    name: customId.modals.bugReport,
  },
  async execute(interaction, client) {
    const bugCommandInput = interaction.fields.getTextInputValue(
      customId.modals.bugCommand
    );
    const bugDescriptionInput = interaction.fields.getTextInputValue(
      customId.modals.bugDescription
    );

    await sendBugReport(
      interaction,
      client,
      bugCommandInput,
      bugDescriptionInput
    );
  },
};
