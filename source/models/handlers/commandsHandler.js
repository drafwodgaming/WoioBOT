const { filePath } = require('@config/botConfig.json');
const fileSystem = require('fs');
const path = require('path');
const asciiTable = require('ascii-table');

module.exports = (client, sourcePath) => {
	client.commandsHandler = async () => {
		const { commands, commandsArray } = client;
		const table = new asciiTable().setHeading('Commands', 'Status');
		const commandsDirectoryPath = path.join(sourcePath, filePath.commandsPath);
		const commandsFiles = fileSystem.readdirSync(commandsDirectoryPath);

		for (const file of commandsFiles) {
			if (file.startsWith('[off]') || !file.endsWith(filePath.jsFileExtension))
				continue;

			const commandFilePath = path.join(commandsDirectoryPath, file);
			const loadedCommand = require(commandFilePath);
			commands.set(loadedCommand.data.name, loadedCommand);
			commandsArray.push(loadedCommand.data.toJSON());
			table.addRow(loadedCommand.data.name, '🟩');
		}

		return console.log(table.toString());
	};
};
