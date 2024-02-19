async function updateRecordField(model, filter, fieldsToUpdate, options = {}) {
	let updateQuery = {};

	if ('$push' in fieldsToUpdate) updateQuery = { $push: fieldsToUpdate.$push };
	else if ('$set' in fieldsToUpdate)
		updateQuery = { $set: fieldsToUpdate.$set };
	else if ('$pull' in fieldsToUpdate)
		updateQuery = { $pull: fieldsToUpdate.$pull };
	else
		throw new Error('Invalid update fields. Supported operators: $set, $push');

	let record = await model.findOneAndUpdate(filter, updateQuery, {
		...options,
		upsert: true,
		setDefaultsOnInsert: true,
	});

	return record;
}

module.exports = { updateRecordField };
