const { getColor } = require('@functions/utils/getColor');

function getColorByPercentage(percentage) {
	const RED_THRESHOLD = 30;
	const ORANGE_THRESHOLD = 50;
	const YELLOW_THRESHOLD = 80;

	const redColor = getColor('activity.redColor');
	const orangeColor = getColor('activity.orangeColor');
	const yellowColor = getColor('activity.yellowColor');
	const greenColor = getColor('activity.greenColor');

	if (percentage <= RED_THRESHOLD) return redColor;
	if (percentage <= ORANGE_THRESHOLD) return orangeColor;
	if (percentage <= YELLOW_THRESHOLD) return yellowColor;
	return greenColor;
}

module.exports = { getColorByPercentage };
