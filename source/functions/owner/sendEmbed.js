const { serverInfoEmbed } = require('@functions/owner/serverInfoEmbed');
const { serverRulesButton } = require('@functions/buttons/setUpButtonRules');
const { infoChannelId } = require('@config/botConfig.json');

async function sendEmbed(client) {
	const channel = await client.channels.fetch(infoChannelId);

	await channel.send({
		embeds: [serverInfoEmbed()],
		components: [serverRulesButton()],
	});
}

module.exports = { sendEmbed };
