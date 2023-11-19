const { colors } = require('@config/botConfig.json');

function getColor(colorName) {
	return parseInt(colors[colorName]);
}

module.exports = { getColor };
