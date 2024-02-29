require('module-alias/register');
const { Client, REST, Routes, Collection } = require('discord.js');
const fileSystem = require('fs');
const path = require('path');
const botConfig = require('@config/botConfig.json');
const botIntents = require('@config/botIntents');
const client = new Client({ intents: botIntents });
const rest = new REST({ version: botConfig.restVersion }).setToken(
	botConfig.tokenDev
);

client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.languages = new Collection();
client.models = new Collection();
client.commandsArray = [];

const handlersDirectory = path.join(__dirname, botConfig.filePath.handlersPath);
const handlersFiles = fileSystem
	.readdirSync(handlersDirectory)
	.filter(file => file.endsWith(botConfig.filePath.jsFileExtension));

for (const file of handlersFiles) {
	const handlerFilePath = path.join(handlersDirectory, file);
	require(handlerFilePath)(client, __dirname);
}
async function setUpBot() {
	client.eventsHandler();
	client.commandsHandler();
	client.componentsHandler();
	client.languagesHandler();
	client.modelsHandler();
	client.login(botConfig.tokenDev);

	await rest.put(Routes.applicationCommands(botConfig.clientIdDev), {
		body: client.commandsArray,
	});
}

setUpBot();
