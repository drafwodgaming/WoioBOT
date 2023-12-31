const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reportBugSchema = new Schema(
	{
		reportId: {
			type: String,
			default: uuidv4(),
		},
		userId: String,
		bugName: String,
		bugDescription: String,
		userMessageId: String,
		devMessageId: String,
	},
	{ strict: false }
);

module.exports = model('reportbug', reportBugSchema);
