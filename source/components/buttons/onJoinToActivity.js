const { buttons } = require('@config/componentsId.json');
const {
	handlerActivity,
} = require('@functions/utils/newActivity/handlerActivity');

module.exports = {
	data: {
		name: buttons.joinToActivityButton,
	},
	async execute(interaction) {
		await handlerActivity(interaction, true);
	},
};
