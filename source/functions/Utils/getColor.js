const { colors } = require('@config/botConfig.json');

function getColor(colorName) {
	const colorPath = colorName.split('.');
	let currentColor = colors;

	for (const pathSegment of colorPath) {
		currentColor = currentColor[pathSegment];
	}

	return parseInt(currentColor);
}

module.exports = { getColor };
