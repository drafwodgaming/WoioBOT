const { Events, ActivityType } = require("discord.js");
const { monoDB } = require("../../config/botConfig.json");
const mongoose = require("mongoose");
const en = require("../../config/languages/en.json");
const chalk = require("chalk");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(monoDB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() =>
        console.log(
          chalk.blue(en.logs.succesMongoDBTitle),
          chalk.black(en.logs.dbConnected)
        )
      )
      .catch((error) => console.log(chalk.red(en.logs.error), error));

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
