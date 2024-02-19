const { Events } = require('discord.js');
const {
	cardLeaveMessage,
} = require('@functions/canvases/setUpCardLeaveMessage');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const { guild, user } = member;
		const channelsCache = guild.channels.cache;

		const leaveChannelSchema = member.client.models.get('leaveChannel');
		const interactionChannelId = await leaveChannelSchema.findOne({
			guildId: guild.id,
		});

		if (!interactionChannelId) return;

		const leaveChannel = channelsCache.find(
			channel => channel.id === interactionChannelId.channelId
		);

		if (user.bot || !leaveChannel) return;

		const leaveMessageCanvas = await cardLeaveMessage(member);
		await leaveChannel.send({ files: [leaveMessageCanvas] });
	},
};
