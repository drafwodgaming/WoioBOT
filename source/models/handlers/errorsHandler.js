const { Client } = require('discord.js');
const en = require('@config/languages/en.json');
const kleur = require('kleur');
/**
 * @param {Client} client
 */
module.exports = async client => {
	process.on('unhandledRejection', error => {
		console.log(kleur.red(en.logs.unhandledRejection), `${error}`);
	});

	process.on('uncaughtException', error => {
		console.log(kleur.red(en.logs.uncaughtException), `${error}`);
	});
};
