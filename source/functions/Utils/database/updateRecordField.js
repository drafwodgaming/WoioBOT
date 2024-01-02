async function updateRecordField(model, filter, fieldsToUpdate) {
	let record = await model.findOneAndUpdate(
		filter,
		{ $set: fieldsToUpdate },
		{ upsert: true, setDefaultsOnInsert: true }
	);

	return record;
}

module.exports = { updateRecordField };
