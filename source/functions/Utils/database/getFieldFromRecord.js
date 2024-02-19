async function getFieldFromRecord(model, filter, fieldToRetrieve) {
	const record = await model.findOne(filter, { [fieldToRetrieve]: 1 });

	if (record) return record[fieldToRetrieve];
}

module.exports = { getFieldFromRecord };
