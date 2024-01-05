const { getGuildLanguage } = require('@functions/utils/getGuildLanguage');

async function getLocalizedText(interaction) {
	const serverLocaleSchema = interaction.client.models.get('serverLocale');
	if (interaction.guild) guildId = interaction.guild.id;
	else guildId = interaction.user.id;

	const userLanguageCode = await getGuildLanguage(guildId, serverLocaleSchema);

	return interaction.client.languages.get(userLanguageCode);
}
module.exports = { getLocalizedText };
