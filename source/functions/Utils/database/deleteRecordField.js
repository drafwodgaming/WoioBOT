async function deleteRecordField(model, filter, fieldsToDelete) {
	// Если поля для удаления не указаны, просто удаляем запись по фильтру
	if (!fieldsToDelete || fieldsToDelete.length === 0) {
		return await model.findOneAndDelete(filter);
	}

	// Формируем объект с полями, которые нужно удалить
	const unsetFields = fieldsToDelete.reduce((acc, field) => {
		acc[field] = 1;
		return acc;
	}, {});

	const deletedRecord = await model.findOneAndUpdate(
		filter,
		{ $unset: unsetFields },
		{ new: true }
	);

	return deletedRecord;
}

module.exports = { deleteRecordField };
