const { filePath } = require('@config/botConfig.json');
const fileSystem = require('fs');
const path = require('path');

module.exports = (client, sourcePath) => {
	client.componentsHandler = async () => {
		const { modals, buttons, selectMenus } = client;
		const componentsFolderPath = path.join(sourcePath, filePath.componentsPath);
		const componentsFolder = fileSystem.readdirSync(componentsFolderPath);

		for (const folder of componentsFolder) {
			const folderPath = path.join(componentsFolderPath, folder);
			const componentFiles = fileSystem
				.readdirSync(folderPath)
				.filter(file => file.endsWith(filePath.jsFileExtension));

			switch (folder) {
				case filePath.modalsPath:
					for (const file of componentFiles) {
						const modalFilePath = path.join(folderPath, file);
						const modalComponent = require(modalFilePath);
						modals.set(modalComponent.data.name, modalComponent);
					}
					break;
				case filePath.buttonsPath:
					for (const file of componentFiles) {
						const buttonFilePath = path.join(folderPath, file);
						const buttonComponent = require(buttonFilePath);
						buttons.set(buttonComponent.data.name, buttonComponent);
					}
					break;
				case filePath.menusPath:
					for (const file of componentFiles) {
						const selectMenuFilePath = path.join(folderPath, file);
						const selectMenuComponent = require(selectMenuFilePath);
						selectMenus.set(selectMenuComponent.data.name, selectMenuComponent);
					}
					break;
			}
		}
	};
};
