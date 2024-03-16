const mustache = require('mustache');

function formatActivityLink(interaction, activity, index, localization) {
	const {
		name: activityName,
		description: activityDescription,
		acceptedPlayers: joinedPlayers,
		maxPlayersCount,
		channelId: channelIdValue,
		messageId: messageIdValue,
	} = activity;

	const playerInfo = `${joinedPlayers.length}/${maxPlayersCount}`;

	const formattedName = mustache.render(
		localization.commands.activity.searchActivity.nameLabel,
		{ name: activityName }
	);
	const formattedDescription = mustache.render(
		localization.commands.activity.searchActivity.descriptionLabel,
		{ description: activityDescription }
	);
	const formattedPlayers = mustache.render(
		localization.commands.activity.searchActivity.playersCountLabel,
		{ playersInfo: playerInfo }
	);

	const linkText = `${
		index + 1
	}. ${formattedName} | ${formattedDescription} | ${formattedPlayers}`;
	const activityLink = `[${linkText}](https://discord.com/channels/${interaction.guild.id}/${channelIdValue}/${messageIdValue})`;

	return `**${activityLink}**`;
}

module.exports = { formatActivityLink };
