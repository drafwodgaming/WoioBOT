function generateActivityEmbed(
	activityTitle,
	activityDescription,
	participantsFieldName,
	acceptedPlayers,
	maxPlayersCount,
	creatorId,
	creatorIdFieldName
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
	};
}

module.exports = { generateActivityEmbed };
