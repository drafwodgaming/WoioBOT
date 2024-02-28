const { getColor } = require('@functions/utils/getColor');

function getColorByPercentage(percentage) {
	let color;

	const redThreshold = 30;
	const orangeThreshold = 50;
	const yellowThreshold = 80;

	const redColor = getColor('activity.redColor');
	const orangeColor = getColor('activity.orangeColor');
	const yellowColor = getColor('activity.yellowColor');
	const greenColor = getColor('activity.greenColor');

	if (percentage <= redThreshold) color = redColor;
	else if (percentage <= orangeThreshold) color = orangeColor;
	else if (percentage <= yellowThreshold) color = yellowColor;
	else color = greenColor;

	return color;
}

module.exports = { getColorByPercentage };
