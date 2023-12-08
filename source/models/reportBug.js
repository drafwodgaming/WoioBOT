// models/reportBug.js
const { Schema, model } = require('mongoose');

const reportBugSchema = new Schema({
	reportId: String,
	userId: String,
	bugName: String,
	bugDescription: String,
	userMessageId: String,
	devMessageId: String,
	reportType: { type: String, enum: ['bug', 'proposal', 'improvement'] },
});

module.exports = model('reportbug', reportBugSchema);
