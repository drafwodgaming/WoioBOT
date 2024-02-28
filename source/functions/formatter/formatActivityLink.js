const mustache = require('mustache');

function formatActivityLink(interaction, activity, index, localizedText) {
	const {
		name,
		description,
		acceptedPlayers,
		maxPlayersCount,
		channelId,
		messageId,
	} = activity;

	const playersInfo = `${acceptedPlayers.length}/${maxPlayersCount}`;

	const nameActivity = mustache.render(
		localizedText.commands.activity.searchActivity.nameSearchLabel,
		{ name }
	);
	const descriptionActivity = mustache.render(
		localizedText.commands.activity.searchActivity.descriptionSearchLabel,
		{ description }
	);
	const playersCountActivity = mustache.render(
		localizedText.commands.activity.searchActivity.playersCountLabel,
		{ playersInfo }
	);

	const activityLink = `[${
		index + 1
	}. ${nameActivity} | ${descriptionActivity} | ${playersCountActivity}]`;
	const messageLink = `(https://discord.com/channels/${interaction.guild.id}/${channelId}/${messageId})`;

	return `**${activityLink}${messageLink}**`;
}

module.exports = { formatActivityLink };
