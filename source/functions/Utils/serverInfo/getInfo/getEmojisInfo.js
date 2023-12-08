async function getEmojisInfo(emojisCache) {
	const totalEmojisCount = emojisCache.size;
	const animatedEmojisCount = emojisCache.filter(emoji => emoji.animated).size;
	const staticEmojisCount = totalEmojisCount - animatedEmojisCount;

	return { totalEmojisCount, animatedEmojisCount, staticEmojisCount };
}

module.exports = { getEmojisInfo };
