const { getColor } = require('@functions/utils/getColor');
const ru = require('@config/languages/ru.json');

function serverInfoEmbed() {
	const defaultBotColor = getColor('default');
	const embed = {
		color: defaultBotColor,
		title: ru.myServer.embeds.infoAboutServer.title,
		description: ru.myServer.embeds.infoAboutServer.description,
		fields: [
			{
				name: '',
				value: ru.myServer.embeds.infoAboutServer.fields.links,
			},
		],
	};

	return embed;
}
module.exports = { serverInfoEmbed };
