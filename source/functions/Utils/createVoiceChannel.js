const { ChannelType, PermissionFlagsBits } = require('discord.js');

async function createVoiceChannel(
	guild,
	member,
	channelName,
	channelSize = 0,
	parent
) {
	const memberPermissions = [
		PermissionFlagsBits.MoveMembers,
		PermissionFlagsBits.MuteMembers,
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.KickMembers,
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.Stream,
	];

	const guildPermissions = [
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.UseVAD,
		PermissionFlagsBits.Stream,
	];

	const permissionOverwrites = [
		{ id: member.id, allow: memberPermissions },
		{ id: member.guild.id, allow: guildPermissions },
	];

	const createdChannel = await guild.channels.create({
		name: channelName,
		type: ChannelType.GuildVoice,
		parent,
		userLimit: channelSize,
		permissionOverwrites,
	});

	return createdChannel;
}

module.exports = { createVoiceChannel };
