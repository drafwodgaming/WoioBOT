// models/reportBug.js
const { Schema, model } = require('mongoose');

const reportBugSchema = new Schema({
	reportId: String,
	userId: String,
	bugCommand: String,
	bugDescription: String,
	messageToUserId: String,
	messageToDevId: String,
});

module.exports = model('reportbug', reportBugSchema);
