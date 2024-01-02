async function getFieldFromRecord(model, filter, fieldToRetrieve) {
	// Use projection to only retrieve the specified field
	const record = await model.findOne(filter, { [fieldToRetrieve]: 1 });

	if (record) return record[fieldToRetrieve];
}

module.exports = { getFieldFromRecord };
