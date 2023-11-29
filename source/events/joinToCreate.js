// Your existing file
const { Events } = require('discord.js');
const {
	createVoiceChannel,
} = require('@source/functions/utils/createVoiceChannel');
const joinToCreateSchema = require('@source/models/joinToCreate');

const temporaryChannels = new Map();

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const member = oldState.member || newState.member;
		const interactionChannelIdData = await joinToCreateSchema.findOne({
			guildId: member.guild.id,
		});
		if (!interactionChannelIdData) return;

		const interactionChannelId = interactionChannelIdData.channelId;

		temporaryChannels.forEach((channel, channelId) => {
			if (channel.members.size === 0) {
				channel.delete();
				temporaryChannels.delete(channelId);
			}
		});

		if (newState.channelId === interactionChannelId) {
			const parent = oldState.channel?.parent ?? newState.channel?.parent;
			const channelName = `${member.user.username} channel`;

			await createVoiceChannel(
				member.guild,
				member,
				channelName,
				0,
				parent
			).then(channel => {
				if (channel && newState) {
					newState.setChannel(channel);
					temporaryChannels.set(channel.id, channel);
				}
			});
		}
	},
};
