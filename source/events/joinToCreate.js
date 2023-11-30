// Your existing file
const { Events } = require('discord.js');
const {
	createVoiceChannel,
} = require('@source/functions/utils/createVoiceChannel');
const joinToCreateSchema = require('@source/models/joinToCreate');
const temporaryChannelsSchema = require('@source/models/temporaryChannels');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const member = oldState.member || newState.member;
		const interactionChannelIdData = await joinToCreateSchema.findOne({
			guildId: member.guild.id,
		});
		if (!interactionChannelIdData) return;

		const interactionChannelId = interactionChannelIdData.channelId;

		const temporaryChannels = await temporaryChannelsSchema.find({
			guildId: member.guild.id,
		});

		temporaryChannels.forEach(async tempChannel => {
			const channel = member.guild.channels.cache.get(tempChannel.channelId);
			if (channel && channel.members.size === 0) {
				await temporaryChannelsSchema.findOneAndDelete(tempChannel._id);
				channel.delete();
			}
		});

		if (newState.channelId === interactionChannelId) {
			const parent = oldState.channel?.parent || newState.channel?.parent;
			const channelName = `${member.user.username} channel`;

			await createVoiceChannel(
				member.guild,
				member,
				channelName,
				0,
				parent
			).then(async channel => {
				if (channel && newState) {
					newState.setChannel(channel);
					await temporaryChannelsSchema.create({
						guildId: member.guild.id,
						channelId: channel.id,
					});
				}
			});
		}
	},
};
