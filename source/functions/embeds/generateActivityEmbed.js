function generateActivityEmbed(
	activityTitle,
	activityDescription,
	participantsFieldName,
	acceptedPlayers,
	maxPlayersCount,
	creatorId,
	creatorIdFieldName,
	colorActivity,
	ownerAvatar
) {
	return {
		title: activityTitle,
		description: activityDescription,
		fields: [
			{
				name: creatorIdFieldName,
				value: `<@${creatorId}>`,
			},
			{
				name: `${participantsFieldName} (${acceptedPlayers.length}/${maxPlayersCount})`,
				value: acceptedPlayers.map(playerId => `<@${playerId}>`).join('\n'),
				inline: true,
			},
		],
		color: colorActivity,
		thumbnail: { url: ownerAvatar },
	};
}

module.exports = { generateActivityEmbed };
