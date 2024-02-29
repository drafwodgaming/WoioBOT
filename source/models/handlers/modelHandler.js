const { filePath } = require('@config/botConfig.json');
const fileSystem = require('fs');
const path = require('path');
const asciiTable = require('ascii-table');

module.exports = (client, sourcePath) => {
	client.modelsHandler = async () => {
		const { models } = client;
		const table = new asciiTable().setHeading('Languages', 'Status');
		const modelsDirectoryPath = path.join(sourcePath, filePath.modelsPath);
		const modelsFiles = fileSystem.readdirSync(modelsDirectoryPath);

		for (const file of modelsFiles) {
			if (!file.endsWith(filePath.jsFileExtension)) continue;

			const modelFilePath = path.join(modelsDirectoryPath, file);
			const modelName = file.slice(0, -3);
			const loadedModel = require(modelFilePath);
			models.set(modelName, loadedModel);

			table.addRow([modelName, '🟩']);
		}
	};
};
