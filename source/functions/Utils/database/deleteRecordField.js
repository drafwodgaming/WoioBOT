async function deleteRecordField(model, filter, fieldsToDelete) {
	if (!fieldsToDelete || fieldsToDelete.length === 0)
		return await model.findOneAndDelete(filter);

	const unsetFields = Object.fromEntries(
		fieldsToDelete.map(field => [field, 1])
	);

	const deletedRecord = await model.findOneAndUpdate(
		filter,
		{ $unset: unsetFields },
		{ new: true }
	);

	return deletedRecord;
}

module.exports = { deleteRecordField };
