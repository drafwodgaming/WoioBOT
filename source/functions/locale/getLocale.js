const { getGuildLanguage } = require('@functions/utils/getGuildLanguage');

async function getLocalizedText(interaction) {
	const serverLocaleSchema = interaction.client.models.get('serverLocale');
	const guildId = interaction.guild
		? interaction.guild.id
		: interaction.user.id;

	const userLanguageCode = await getGuildLanguage(guildId, serverLocaleSchema);

	return interaction.client.languages.get(userLanguageCode);
}
module.exports = { getLocalizedText };
