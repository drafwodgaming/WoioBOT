const { filePath } = require('@config/botConfig.json');
const fileSystem = require('fs');
const path = require('path');

module.exports = (client, sourcePath) => {
	client.eventsHandler = async () => {
		const eventsFolderPath = path.join(sourcePath, filePath.eventsPath);
		const eventsFiles = fileSystem
			.readdirSync(eventsFolderPath)
			.filter(file => file.endsWith(filePath.jsFileExtension));

		for (const file of eventsFiles) {
			const eventFilePath = path.join(eventsFolderPath, file);
			const event = require(eventFilePath);

			if (event.once)
				client.once(event.name, (...args) => event.execute(...args, client));
			else client.on(event.name, (...args) => event.execute(...args, client));
		}
	};
};
