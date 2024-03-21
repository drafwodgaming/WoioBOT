const { getColor } = require('@functions/utils/getColor');
const ru = require('@config/languages/ru.json');

function serverRulesEmbed() {
	const politeColor = getColor('rules.politeColor');
	const noSpamColor = getColor('rules.noSpamColor');
	const personalDataColor = getColor('rules.personalDataColor');
	const gameRoleColor = getColor('rules.gameRoleColor');
	const reportToUsColor = getColor('rules.reportToUsColor');

	const rules = [
		{
			color: politeColor,
			title: ru.myServer.embeds.serverRules.politeEmbed.title,
			description: ru.myServer.embeds.serverRules.politeEmbed.description,
		},
		{
			color: noSpamColor,
			title: ru.myServer.embeds.serverRules.noSpamEmbed.title,
			description: ru.myServer.embeds.serverRules.noSpamEmbed.description,
		},
		{
			color: personalDataColor,
			title: ru.myServer.embeds.serverRules.personalDataEmbed.title,
			description: ru.myServer.embeds.serverRules.personalDataEmbed.description,
		},
		{
			color: gameRoleColor,
			title: ru.myServer.embeds.serverRules.gameCommunity.title,
			description: ru.myServer.embeds.serverRules.gameCommunity.description,
		},
		{
			color: reportToUsColor,
			title: ru.myServer.embeds.serverRules.reportToUsEmbed.title,
			description: ru.myServer.embeds.serverRules.reportToUsEmbed.description,
		},
	];

	return rules;
}

module.exports = { serverRulesEmbed };
