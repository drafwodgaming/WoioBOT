const { filePath } = require('@config/botConfig.json');
const fileSystem = require('fs');
const path = require('path');
const asciiTable = require('ascii-table');

module.exports = (client, sourcePath) => {
	client.languagesHandler = async () => {
		const { languages } = client;
		const table = new asciiTable().setHeading('Languages', 'Status');
		const languagesDirectoryPath = path.join(
			sourcePath,
			'..',
			filePath.languagesPath
		);
		const languagesFiles = fileSystem.readdirSync(languagesDirectoryPath);

		for (const file of languagesFiles) {
			if (!file.endsWith(filePath.jsonFileExtension)) continue;

			const languageFilePath = path.join(languagesDirectoryPath, file);
			const loadedLanguage = require(languageFilePath);
			languages.set(loadedLanguage.code, loadedLanguage);
			table.addRow(loadedLanguage.code, '🟩');
		}

		console.log(table.toString());
	};
};
