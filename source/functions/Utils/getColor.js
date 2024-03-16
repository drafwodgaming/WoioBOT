const { colors } = require('@config/botConfig.json');

function getColor(colorName) {
	const colorPathSegments = colorName.split('.');
	let currentColorObject = colors;

	for (const segment of colorPathSegments) {
		currentColorObject = currentColorObject[segment];
	}

	return parseInt(currentColorObject);
}

module.exports = { getColor };
