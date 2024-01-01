const { getGuildLanguage } = require('@functions/utils/getGuildLanguage');
const serverLocaleSchema = require('@source/models/serverLocale');

async function getLocalizedText(interaction) {
	if (interaction.guild) guildId = interaction.guild.id;
	else guildId = interaction.user.id;

	const userLanguageCode = await getGuildLanguage(guildId, serverLocaleSchema);

	return interaction.client.languages.get(userLanguageCode);
}
module.exports = { getLocalizedText };
