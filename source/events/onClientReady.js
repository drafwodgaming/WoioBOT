const { Events, ActivityType } = require("discord.js");
const botConfig = require("../../config/botConfig.json");
const mongoose = require("mongoose");
const consoleLogs = require("../../config/consoleLogs.json");
const chalk = require("chalk");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(botConfig.monoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() =>
        console.log(
          chalk.blue(consoleLogs.succesMongoDBTitle),
          chalk.black(consoleLogs.dbConnected)
        )
      )
      .catch((error) => console.log(chalk.red(consoleLogs.error), error));

    client.user.setActivity({
      type: ActivityType.Custom,
      name: "customStatus",
      state: "🧩 LetsGo!",
    });

    const clientData = [
      {
        Name: client.user.tag,
        Servers: client.guilds.cache.size,
        Channels: client.channels.cache.size,
      },
    ];
    console.table(clientData);
  },
};
