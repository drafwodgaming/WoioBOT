const { getColor } = require('@functions/utils/getColor');
const ru = require('@config/languages/ru.json');

function serverRulesEmbed() {
	const politeColor = getColor('rules.politeColor');
	const noSpamColor = getColor('rules.noSpamColor');
	const personalDataColor = getColor('rules.personalDataColor');
	const adultContentColor = getColor('rules.adultContentColor');
	const streamingBehaviorColor = getColor('rules.streamingBehaviorColor');
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
			color: adultContentColor,
			title: ru.myServer.embeds.serverRules.adultContentEmbed.title,
			description: ru.myServer.embeds.serverRules.adultContentEmbed.description,
		},
		{
			color: streamingBehaviorColor,
			title: ru.myServer.embeds.serverRules.streamingBehaviorEmbed.title,
			description:
				ru.myServer.embeds.serverRules.streamingBehaviorEmbed.description,
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
