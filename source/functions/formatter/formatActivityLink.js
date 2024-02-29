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

	const activityLinkText = `${
		index + 1
	}. ${nameActivity} | ${descriptionActivity} | ${playersCountActivity}`;

	const activityLink = `[${activityLinkText}]`;

	const messageLink = `(https://discord.com/channels/${interaction.guild.id}/${channelId}/${messageId})`;

	const finalFormattedLink = `**${activityLink}${messageLink}**`;

	return finalFormattedLink;
}

module.exports = { formatActivityLink };
