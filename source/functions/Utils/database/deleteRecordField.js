async function deleteRecordField(model, filter, fieldsToDelete) {
	if (!fieldsToDelete || fieldsToDelete.length === 0) {
		// Если поля не указаны, просто удаляем запись по фильтру
		const deletedRecord = await model.findOneAndDelete(filter);
		return deletedRecord;
	} else {
		const unsetFields = {};
		fieldsToDelete.forEach(field => {
			unsetFields[field] = 1;
		});

		const deletedRecord = await model.findOneAndUpdate(
			filter,
			{ $unset: unsetFields },
			{ new: true }
		);
		return deletedRecord;
	}
}

module.exports = { deleteRecordField };
