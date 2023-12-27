const { buttons } = require('@config/componentsId.json');
const { serverRulesEmbed } = require('@functions/owner/serverRulesEmbed');

module.exports = {
	data: {
		name: buttons.rulesButton,
	},
	async execute(interaction) {
		interaction.reply({ embeds: serverRulesEmbed(), ephemeral: true });
	},
};
