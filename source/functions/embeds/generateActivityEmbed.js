function generateActivityEmbed(
	title,
	description,
	participantsFieldName,
	acceptedPlayerIds,
	maxPlayerCount,
	creatorId,
	creatorIdFieldName,
	color,
	ownerAvatarUrl
) {
	const participantsFieldValue = acceptedPlayerIds
		.map(id => `<@${id}>`)
		.join('\n');

	return {
		title,
		description,
		fields: [
			{ name: creatorIdFieldName, value: `<@${creatorId}>` },
			{
				name: `${participantsFieldName} (${acceptedPlayerIds.length}/${maxPlayerCount})`,
				value: participantsFieldValue,
				inline: true,
			},
		],
		color,
		thumbnail: { url: ownerAvatarUrl },
	};
}

module.exports = { generateActivityEmbed };
