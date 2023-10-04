const { filePath } = require("../../config/botConfig.json");
const fileSystem = require("fs");
const path = require("path");

module.exports = (client, sourcePath) => {
  client.componentsHandler = async () => {
    const { modals, buttons, selectMenus } = client;
    const componentsPath = path.join(sourcePath, filePath.componentsPath);
    const componentsFolder = fileSystem.readdirSync(componentsPath);
    for (const folder of componentsFolder) {
      const folderPath = path.join(componentsPath, folder);
      const componentFiles = fileSystem
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(filePath.jsFileExtension));

      switch (folder) {
        case filePath.modalsPath:
          for (const file of componentFiles) {
            const modalFilePath = path.join(folderPath, file);
            const modal = require(modalFilePath);
            modals.set(modal.data.name, modal);
          }
          break;
        case filePath.buttonsPath:
          for (const file of componentFiles) {
            const buttonFilePath = path.join(folderPath, file);
            const button = require(buttonFilePath);
            buttons.set(button.data.name, button);
          }
          break;
        case filePath.menusPath:
          for (const file of componentFiles) {
            const selectMenuFilePath = path.join(folderPath, file);
            const selectmenu = require(selectMenuFilePath);
            selectMenus.set(selectmenu.data.name, selectmenu);
          }
          break;
      }
    }
  };
};
