// channelUtils.js
const { ChannelType, PermissionFlagsBits } = require('discord.js');

async function createVoiceChannel(
	guild,
	member,
	channelName,
	channelSize,
	parent
) {
	return guild.channels.create({
		name: channelName,
		type: ChannelType.GuildVoice,
		parent: parent,
		userLimit: channelSize || 0,
		permissionOverwrites: [
			{
				id: member.id,
				allow: [
					PermissionFlagsBits.ManageChannels,
					PermissionFlagsBits.MoveMembers,
					PermissionFlagsBits.MuteMembers,
					PermissionFlagsBits.Connect,
					PermissionFlagsBits.KickMembers,
					PermissionFlagsBits.Speak,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.Stream,
				],
			},
			{
				id: member.guild.id,
				allow: [
					PermissionFlagsBits.Speak,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.Connect,
					PermissionFlagsBits.ReadMessageHistory,
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.UseVAD,
				],
			},
		],
	});
}

module.exports = {
	createVoiceChannel,
};
