const { Client } = require("discord.js");
const en = require("../../config/languages/en.json");
const chalk = require("chalk");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  process.on("unhandledRejection", (error) => {
    console.log(chalk.red(en.logs.unhandledRejection), `${error}`);
  });

  process.on("uncaughtException", (error) => {
    console.log(chalk.red(en.logs.uncaughtException), `${error}`);
  });
};
