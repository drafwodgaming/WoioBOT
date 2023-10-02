const i18n = require("i18n");

function getUserLocale(interaction) {
  if (interaction && interaction.locale) {
    const userLocale = interaction.locale;
    i18n.setLocale(userLocale);
    return userLocale;
  }
  return i18n.getLocale();
}

module.exports = { getUserLocale };
